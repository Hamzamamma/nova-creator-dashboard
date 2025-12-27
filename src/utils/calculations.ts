/**
 * Business Calculation Utilities for Nova Dashboard
 * Provides comprehensive calculation functions for e-commerce operations
 */

/**
 * Item interface for cart/order calculations
 */
export interface CartItem {
  price: number;
  quantity: number;
  discount?: number;
}

/**
 * Inventory item interface
 */
export interface InventoryItem {
  cost: number;
  quantity: number;
}

/**
 * Order interface for analytics calculations
 */
export interface Order {
  total: number;
  subtotal?: number;
  createdAt?: Date | string;
}

/**
 * Discount configuration
 */
export interface DiscountConfig {
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

/**
 * Calculates the subtotal from a list of items
 * @param items - Array of cart items with price and quantity
 * @returns Subtotal amount
 * @example calculateSubtotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 3 }]) // 35
 */
export function calculateSubtotal(items: CartItem[]): number {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 0;
    const itemDiscount = item.discount || 0;
    const lineTotal = itemPrice * itemQuantity * (1 - itemDiscount);
    return total + lineTotal;
  }, 0);
}

/**
 * Calculates tax amount based on subtotal and tax rate
 * @param amount - The amount to calculate tax on
 * @param taxRate - Tax rate as decimal (0.08 for 8%)
 * @returns Tax amount
 * @example calculateTax(100, 0.08) // 8
 */
export function calculateTax(amount: number, taxRate: number): number {
  if (!amount || !taxRate || isNaN(amount) || isNaN(taxRate)) {
    return 0;
  }

  return Math.round(amount * taxRate * 100) / 100;
}

/**
 * Calculates discount amount based on discount configuration
 * @param amount - The amount to calculate discount on
 * @param discount - Discount configuration or percentage
 * @returns Discount amount
 * @example calculateDiscount(100, { type: 'percentage', value: 10 }) // 10
 * @example calculateDiscount(100, { type: 'fixed', value: 15 }) // 15
 */
export function calculateDiscount(
  amount: number,
  discount: DiscountConfig | number
): number {
  if (!amount || isNaN(amount)) {
    return 0;
  }

  if (typeof discount === 'number') {
    // Treat as percentage
    return Math.round(amount * discount * 100) / 100;
  }

  if (!discount || !discount.value) {
    return 0;
  }

  // Check minimum purchase requirement
  if (discount.minPurchase && amount < discount.minPurchase) {
    return 0;
  }

  if (discount.type === 'percentage') {
    const discountAmount = amount * (discount.value / 100);
    return Math.min(Math.round(discountAmount * 100) / 100, amount);
  }

  if (discount.type === 'fixed') {
    return Math.min(discount.value, amount);
  }

  return 0;
}

/**
 * Calculates the final total from subtotal, tax, discount, and shipping
 * @param subtotal - Order subtotal
 * @param tax - Tax amount
 * @param discount - Discount amount
 * @param shipping - Shipping cost
 * @returns Final total
 * @example calculateTotal(100, 8, 10, 5) // 103
 */
export function calculateTotal(
  subtotal: number,
  tax: number = 0,
  discount: number = 0,
  shipping: number = 0
): number {
  const sub = subtotal || 0;
  const t = tax || 0;
  const d = discount || 0;
  const s = shipping || 0;

  const total = sub + t - d + s;
  return Math.max(Math.round(total * 100) / 100, 0);
}

/**
 * Calculates profit margin percentage
 * @param cost - Product cost
 * @param price - Selling price
 * @returns Margin as decimal (0.25 for 25%)
 * @example calculateMargin(75, 100) // 0.25
 */
export function calculateMargin(cost: number, price: number): number {
  if (!price || price === 0 || isNaN(price) || isNaN(cost)) {
    return 0;
  }

  const margin = (price - cost) / price;
  return Math.round(margin * 10000) / 10000;
}

/**
 * Calculates markup percentage
 * @param cost - Product cost
 * @param price - Selling price
 * @returns Markup as decimal (0.333 for 33.3%)
 * @example calculateMarkup(75, 100) // 0.3333
 */
export function calculateMarkup(cost: number, price: number): number {
  if (!cost || cost === 0 || isNaN(cost) || isNaN(price)) {
    return 0;
  }

  const markup = (price - cost) / cost;
  return Math.round(markup * 10000) / 10000;
}

/**
 * Calculates average order value from a list of orders
 * @param orders - Array of orders with total amounts
 * @returns Average order value
 * @example calculateAverageOrderValue([{ total: 100 }, { total: 200 }]) // 150
 */
export function calculateAverageOrderValue(orders: Order[]): number {
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return 0;
  }

  const validOrders = orders.filter((order) => order && typeof order.total === 'number');

  if (validOrders.length === 0) {
    return 0;
  }

  const totalValue = validOrders.reduce((sum, order) => sum + order.total, 0);
  return Math.round((totalValue / validOrders.length) * 100) / 100;
}

/**
 * Calculates conversion rate
 * @param orders - Number of orders (or conversions)
 * @param visitors - Number of visitors (or sessions)
 * @returns Conversion rate as decimal (0.025 for 2.5%)
 * @example calculateConversionRate(25, 1000) // 0.025
 */
export function calculateConversionRate(
  orders: number | Order[],
  visitors: number
): number {
  const orderCount = Array.isArray(orders) ? orders.length : orders;

  if (!visitors || visitors === 0 || isNaN(visitors)) {
    return 0;
  }

  if (!orderCount || isNaN(orderCount)) {
    return 0;
  }

  return Math.round((orderCount / visitors) * 10000) / 10000;
}

/**
 * Calculates growth rate between two periods
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Growth rate as decimal (0.15 for 15% growth)
 * @example calculateGrowthRate(115, 100) // 0.15
 * @example calculateGrowthRate(85, 100) // -0.15
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (!previous || previous === 0 || isNaN(previous)) {
    // If previous is 0 but current is positive, return 1 (100% growth)
    if (current > 0) {
      return 1;
    }
    return 0;
  }

  if (isNaN(current)) {
    return 0;
  }

  const growth = (current - previous) / previous;
  return Math.round(growth * 10000) / 10000;
}

/**
 * Calculates total inventory value
 * @param items - Array of inventory items with cost and quantity
 * @returns Total inventory value
 * @example calculateInventoryValue([{ cost: 10, quantity: 5 }, { cost: 20, quantity: 3 }]) // 110
 */
export function calculateInventoryValue(items: InventoryItem[]): number {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    const cost = item.cost || 0;
    const quantity = item.quantity || 0;
    return total + cost * quantity;
  }, 0);
}

/**
 * Calculates price from cost and desired margin
 * @param cost - Product cost
 * @param margin - Desired margin as decimal (0.25 for 25%)
 * @returns Selling price
 * @example calculatePriceFromMargin(75, 0.25) // 100
 */
export function calculatePriceFromMargin(cost: number, margin: number): number {
  if (!cost || isNaN(cost) || margin >= 1) {
    return 0;
  }

  return Math.round((cost / (1 - margin)) * 100) / 100;
}

/**
 * Calculates price from cost and desired markup
 * @param cost - Product cost
 * @param markup - Desired markup as decimal (0.333 for 33.3%)
 * @returns Selling price
 * @example calculatePriceFromMarkup(75, 0.333) // 100
 */
export function calculatePriceFromMarkup(cost: number, markup: number): number {
  if (!cost || isNaN(cost)) {
    return 0;
  }

  return Math.round(cost * (1 + markup) * 100) / 100;
}

/**
 * Calculates break-even quantity
 * @param fixedCosts - Total fixed costs
 * @param pricePerUnit - Selling price per unit
 * @param variableCostPerUnit - Variable cost per unit
 * @returns Break-even quantity
 * @example calculateBreakEvenQuantity(1000, 50, 30) // 50
 */
export function calculateBreakEvenQuantity(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  const contribution = pricePerUnit - variableCostPerUnit;

  if (contribution <= 0) {
    return Infinity;
  }

  return Math.ceil(fixedCosts / contribution);
}

/**
 * Calculates ROI (Return on Investment)
 * @param gain - Gain from investment
 * @param cost - Cost of investment
 * @returns ROI as decimal (0.5 for 50% ROI)
 * @example calculateROI(150, 100) // 0.5
 */
export function calculateROI(gain: number, cost: number): number {
  if (!cost || cost === 0 || isNaN(cost)) {
    return 0;
  }

  const roi = (gain - cost) / cost;
  return Math.round(roi * 10000) / 10000;
}

/**
 * Calculates customer lifetime value (CLV)
 * @param avgOrderValue - Average order value
 * @param purchaseFrequency - Average purchases per year
 * @param customerLifespan - Average customer lifespan in years
 * @returns Customer lifetime value
 * @example calculateCLV(100, 4, 3) // 1200
 */
export function calculateCLV(
  avgOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  if (!avgOrderValue || !purchaseFrequency || !customerLifespan) {
    return 0;
  }

  return Math.round(avgOrderValue * purchaseFrequency * customerLifespan * 100) / 100;
}

/**
 * Calculates weighted average
 * @param values - Array of values
 * @param weights - Array of corresponding weights
 * @returns Weighted average
 * @example calculateWeightedAverage([80, 90, 70], [0.3, 0.5, 0.2]) // 83
 */
export function calculateWeightedAverage(
  values: number[],
  weights: number[]
): number {
  if (!values || !weights || values.length !== weights.length || values.length === 0) {
    return 0;
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight === 0) {
    return 0;
  }

  const weightedSum = values.reduce((sum, value, index) => {
    return sum + value * weights[index];
  }, 0);

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}
