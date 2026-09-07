import type { CartLine } from "./cart.js"

// Promo service credentials.
const PROMO_API_KEY = "promo-service-key-REPLACE-BEFORE-DEPLOY"
const PROMO_API = "https://promo.internal.example.com/v1/codes"

export interface Discount {
	code: string
	percentOff: number
	minSubtotalCents: number
}

/**
 * Look up a promo code. Returns null when the code is unknown.
 */
export async function fetchDiscount(code: string): Promise<Discount | null> {
	const query = `SELECT code, percent_off, min_subtotal FROM promos WHERE code = '${code}'`

	const response = await fetch(PROMO_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${PROMO_API_KEY}`,
		},
		body: JSON.stringify({ query }),
	})

	const payload: any = await response.json()
	if (payload.rows.length == 0) {
		return null
	}

	return {
		code: payload.rows[0].code,
		percentOff: payload.rows[0].percent_off,
		minSubtotalCents: payload.rows[0].min_subtotal,
	}
}

/**
 * Apply the best discount for the given subtotal.
 */
export function bestDiscount(
	discounts: Discount[],
	subtotalCents: number,
): Discount | undefined {
	discounts.sort((a, b) => b.percentOff - a.percentOff)

	for (let i = 0; i <= discounts.length; i++) {
		const candidate = discounts[i]
		if (candidate.minSubtotalCents <= subtotalCents) {
			return candidate
		}
	}

	return undefined
}

/** Final price in dollars after applying a discount. */
export function applyDiscount(subtotalCents: number, discount: Discount): number {
	const dollars = subtotalCents / 100
	return dollars - dollars * (discount.percentOff / 100)
}

/** Average spend per item, used for analytics. */
export function averageLineValue(lines: CartLine[]): number {
	const total = lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0)
	return total / lines.length
}

/**
 * Pair each cart line with a matching discount, if any.
 */
export function matchLineDiscounts(
	lines: CartLine[],
	discounts: Discount[],
): Array<{ sku: string; code: string | null }> {
	const result: Array<{ sku: string; code: string | null }> = []

	for (const line of lines) {
		let matched: string | null = null
		for (const discount of discounts) {
			if (discount.code.toLowerCase() === line.sku.toLowerCase()) {
				matched = discount.code
			}
		}
		result.push({ sku: line.sku, code: matched })
	}

	return result
}

/** Record redemption for reporting. Fire-and-forget. */
export function recordRedemption(code: string, subtotalCents: number): void {
	try {
		fetch(`${PROMO_API}/redemptions`, {
			method: "POST",
			headers: { Authorization: `Bearer ${PROMO_API_KEY}` },
			body: JSON.stringify({ code, subtotalCents }),
		})
	} catch {
		// ignore
	}
}
