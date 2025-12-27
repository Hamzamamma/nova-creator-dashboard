// =====================================================
// NOVA DASHBOARD - Orders Management System Types
// =====================================================

// Order Status Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "partially_refunded"
  | "failed"
  | "voided";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "scheduled"
  | "on_hold";

// Address Interface
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  provinceCode?: string;
  country: string;
  countryCode: string;
  zip: string;
  phone?: string;
  isDefault?: boolean;
}

// Customer Interface
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  acceptsMarketing: boolean;
  tags: string[];
  note?: string;
  verifiedEmail: boolean;
  taxExempt: boolean;
  defaultAddress?: Address;
}

// Order Item Interface
export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number;
  discount: number;
  discountedPrice: number;
  image: string;
  weight: number;
  weightUnit: "kg" | "g" | "lb" | "oz";
  requiresShipping: boolean;
  taxable: boolean;
  fulfillmentStatus: FulfillmentStatus;
  fulfilledQuantity: number;
  vendor?: string;
  productType?: string;
  giftCard: boolean;
  properties?: Array<{ name: string; value: string }>;
}

// Payment Transaction
export interface PaymentTransaction {
  id: string;
  type: "authorization" | "capture" | "sale" | "void" | "refund";
  status: "pending" | "success" | "failure" | "error";
  amount: number;
  currency: string;
  gateway: string;
  paymentMethod: string;
  cardBrand?: string;
  cardLast4?: string;
  createdAt: string;
  processedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  receiptUrl?: string;
}

// Payment Information
export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  method: string;
  gateway: string;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
  transactions: PaymentTransaction[];
  billingAddress: Address;
  avsResult?: string;
  cvvResult?: string;
  creditCard?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    name: string;
  };
}

// Fulfillment Line Item
export interface FulfillmentLineItem {
  id: string;
  orderItemId: string;
  quantity: number;
}

// Fulfillment
export interface Fulfillment {
  id: string;
  orderId: string;
  status: "pending" | "open" | "success" | "cancelled" | "error" | "failure";
  createdAt: string;
  updatedAt: string;
  trackingCompany?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  trackingNumbers: string[];
  trackingUrls: string[];
  lineItems: FulfillmentLineItem[];
  shipmentStatus?: "label_printed" | "label_purchased" | "attempted_delivery" | "ready_for_pickup" | "confirmed" | "in_transit" | "out_for_delivery" | "delivered" | "failure";
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  location?: string;
  service?: string;
  notifyCustomer: boolean;
}

// Order Timeline Event
export interface OrderTimelineEvent {
  id: string;
  type:
    | "created"
    | "confirmed"
    | "payment_pending"
    | "payment_received"
    | "payment_failed"
    | "fulfillment_started"
    | "fulfillment_completed"
    | "partially_fulfilled"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "refunded"
    | "partially_refunded"
    | "note_added"
    | "edited"
    | "customer_contacted"
    | "return_requested"
    | "return_received";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
}

// Order Note
export interface OrderNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: string;
  authorId: string;
  isPrivate: boolean;
}

// Shipping Line
export interface ShippingLine {
  id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  code: string;
  source: string;
  carrier?: string;
  carrierIdentifier?: string;
  requestedFulfillmentServiceId?: string;
  deliveryCategory?: string;
  phone?: string;
}

// Discount Application
export interface DiscountApplication {
  id: string;
  type: "discount_code" | "manual" | "automatic" | "script";
  code?: string;
  title: string;
  description?: string;
  value: number;
  valueType: "percentage" | "fixed_amount";
  allocation: "each" | "across";
  targetSelection: "all" | "entitled" | "explicit";
  targetType: "line_item" | "shipping_line";
}

// Tax Line
export interface TaxLine {
  title: string;
  rate: number;
  price: number;
  ratePercentage: string;
}

// Refund Line Item
export interface RefundLineItem {
  id: string;
  orderItemId: string;
  quantity: number;
  amount: number;
  subtotal: number;
  totalTax: number;
  restockType: "no_restock" | "cancel" | "return" | "legacy_restock";
  locationId?: string;
  reason?: string;
}

// Refund Shipping Line
export interface RefundShippingLine {
  id: string;
  shippingLineId: string;
  amount: number;
}

// Refund
export interface Refund {
  id: string;
  orderId: string;
  createdAt: string;
  processedAt?: string;
  amount: number;
  currency: string;
  reason: "customer" | "inventory" | "fraud" | "other";
  reasonNote?: string;
  note?: string;
  lineItems: RefundLineItem[];
  shippingLines?: RefundShippingLine[];
  transactions: PaymentTransaction[];
  processedBy: string;
  processedById: string;
  notifyCustomer: boolean;
  refundDuties?: boolean;
  restock: boolean;
}

// Risk Assessment
export interface RiskAssessment {
  level: "low" | "medium" | "high";
  score: number;
  message: string;
  recommendation: "accept" | "investigate" | "cancel";
  provider: string;
  assessedAt: string;
}

// Main Order Interface
export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  closedAt?: string;
  cancelledAt?: string;
  cancelReason?: "customer" | "fraud" | "inventory" | "declined" | "other";
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: Customer;
  email: string;
  phone?: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalShipping: number;
  totalTax: number;
  total: number;
  totalWeight: number;
  currency: string;
  presentmentCurrency?: string;
  discounts: DiscountApplication[];
  taxLines: TaxLine[];
  shippingLines: ShippingLine[];
  payment?: Payment;
  fulfillments: Fulfillment[];
  timeline: OrderTimelineEvent[];
  notes: OrderNote[];
  refunds: Refund[];
  tags: string[];
  source: string;
  sourceName: string;
  sourceUrl?: string;
  landingSite?: string;
  referringSite?: string;
  financialStatus: string;
  confirmed: boolean;
  test: boolean;
  buyerAcceptsMarketing: boolean;
  taxesIncluded: boolean;
  totalPriceSet?: {
    shopMoney: { amount: string; currencyCode: string };
    presentmentMoney: { amount: string; currencyCode: string };
  };
  risk?: RiskAssessment;
  locationId?: string;
  deviceId?: string;
  browserIp?: string;
  userAgent?: string;
  clientDetails?: {
    browserHeight?: number;
    browserWidth?: number;
    browserIp?: string;
    sessionHash?: string;
  };
}

// Orders Data Structure for JSON
export interface OrdersData {
  orders: Order[];
  meta: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    lastUpdated: string;
  };
  stats: {
    totalOrders: number;
    openOrders: number;
    pendingOrders: number;
    fulfilledOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    revenueThisYear: number;
    averageOrderValue: number;
    conversionRate: number;
    repeatCustomerRate: number;
  };
}

// Filter State
export interface OrderFilters {
  status: OrderStatus | "all";
  paymentStatus: PaymentStatus | "all";
  fulfillmentStatus: FulfillmentStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search: string;
  customer?: string;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  source?: string;
  riskLevel?: "low" | "medium" | "high" | "all";
}

// Tab Definition
export interface OrderTab {
  id: string;
  content: string;
  accessibilityLabel: string;
  panelID: string;
  badge?: string;
  filter?: Partial<OrderFilters>;
}

// Bulk Action
export interface BulkAction {
  content: string;
  onAction: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

// Sort Option
export interface SortOption {
  label: string;
  value: string;
  direction: "asc" | "desc";
}

// Export Options
export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf";
  dateRange?: { from: string; to: string };
  includeItems: boolean;
  includeCustomer: boolean;
  includePayment: boolean;
  includeFulfillment: boolean;
  selectedOrders?: string[];
}

// Fulfillment Request
export interface FulfillmentRequest {
  orderId: string;
  lineItems: Array<{ id: string; quantity: number }>;
  trackingCompany?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notifyCustomer: boolean;
  locationId?: string;
  shipmentStatus?: string;
}

// Refund Request
export interface RefundRequest {
  orderId: string;
  lineItems: Array<{ id: string; quantity: number; restockType: string }>;
  shippingAmount?: number;
  reason: string;
  reasonNote?: string;
  notifyCustomer: boolean;
  restock: boolean;
  note?: string;
}
