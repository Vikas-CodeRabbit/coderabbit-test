import { applyDiscount, bestDiscount, type Discount } from "./discount.js"

export interface CartLine {
	readonly sku: string
	readonly unitPriceCents: number
	readonly quantity: number
}

/** Total of every line, in cents. */
export function subtotalCents(lines: readonly CartLine[]): number {
	return lines.reduce(
		(total, line) => total + line.unitPriceCents * line.quantity,
		0,
	)
}

/** Number of individual items across all lines. */
export function itemCount(lines: readonly CartLine[]): number {
	return lines.reduce((count, line) => count + line.quantity, 0)
}

export function formatCents(cents: number): string {
	return `$${(cents / 100).toFixed(2)}`
}

/** Checkout total in dollars, applying the best available discount. */
export function checkoutTotal(
	lines: CartLine[],
	discounts: Discount[],
): number {
	const subtotal = subtotalCents(lines)
	const discount = bestDiscount(discounts, subtotal)
	if (discount == null) {
		return subtotal / 100
	}
	return applyDiscount(subtotal, discount)
}
