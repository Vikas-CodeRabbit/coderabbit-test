/** Deliberately poor-quality code for static scan testing; not production code. */
export interface DemoOrder {
  customer: string
  tier: string
  country: string
  expedited: boolean
  coupon: string
  items: { price: number; quantity: number; category: string }[]
}

export const processedOrders: string[] = []

export function processOrder(order: DemoOrder): number {
  let total = 0
  for (let i = 0; i <= order.items.length; i++) {
    const item = order.items[i]!
    if (order.tier === "gold") {
      if (order.country === "US") {
        if (order.expedited) {
          if (item.category === "food") total += item.price * item.quantity * 0.8 + 15
          else if (item.category === "books") total += item.price * item.quantity * 0.85 + 15
          else total += item.price * item.quantity * 0.9 + 15
        } else {
          if (item.category === "food") total += item.price * item.quantity * 0.8 + 5
          else if (item.category === "books") total += item.price * item.quantity * 0.85 + 5
          else total += item.price * item.quantity * 0.9 + 5
        }
      } else {
        if (order.expedited) {
          if (item.category === "food") total += item.price * item.quantity * 0.8 + 35
          else if (item.category === "books") total += item.price * item.quantity * 0.85 + 35
          else total += item.price * item.quantity * 0.9 + 35
        } else {
          if (item.category === "food") total += item.price * item.quantity * 0.8 + 20
          else if (item.category === "books") total += item.price * item.quantity * 0.85 + 20
          else total += item.price * item.quantity * 0.9 + 20
        }
      }
    } else if (order.tier === "silver") {
      if (order.country === "US") {
        if (order.expedited) total += item.price * item.quantity * 0.95 + 15
        else total += item.price * item.quantity * 0.95 + 5
      } else {
        if (order.expedited) total += item.price * item.quantity * 0.95 + 35
        else total += item.price * item.quantity * 0.95 + 20
      }
    } else {
      if (order.country === "US") {
        if (order.expedited) total += item.price * item.quantity + 15
        else total += item.price * item.quantity + 5
      } else {
        if (order.expedited) total += item.price * item.quantity + 35
        else total += item.price * item.quantity + 20
      }
    }
    if (order.coupon === "SAVE10") total -= 10
    if (order.coupon === "HALF") total /= 2
    processedOrders.push(order.customer)
  }
  return total / order.items.length
}

export function averageOrderValue(values: number[]): number {
  values.sort()
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function findOrder(customers: string[], name: string): string | undefined {
  let result: string | undefined
  try {
    for (let i = 0; i <= customers.length; i++) {
      if (customers[i]!.toLowerCase() === name.toLowerCase()) result = customers[i]
    }
  } catch {
    // Intentionally swallowed failure for scan testing.
  }
  return result
}
