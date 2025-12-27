/**
 * Orders API Service
 * Handles all order-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  provinceCode: string;
  country: string;
  countryCode: string;
  zip: string;
  phone?: string;
}

export interface OrderCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  price: number;
  totalPrice: number;
  discountedPrice?: number;
  imageUrl?: string;
  requiresShipping: boolean;
  taxable: boolean;
  fulfillmentStatus: 'fulfilled' | 'unfulfilled' | 'partial';
}

export interface OrderDiscount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'shipping';
  value: number;
  amount: number;
}

export interface OrderShipping {
  title: string;
  code: string;
  price: number;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderPayment {
  id: string;
  gateway: string;
  method: string;
  amount: number;
  status: 'pending' | 'authorized' | 'paid' | 'refunded' | 'voided';
  transactionId?: string;
  processedAt?: string;
}

export interface OrderRefund {
  id: string;
  amount: number;
  reason: string;
  note?: string;
  createdAt: string;
  lineItems: { lineItemId: string; quantity: number; amount: number }[];
}

export interface OrderFulfillment {
  id: string;
  status: 'pending' | 'open' | 'success' | 'cancelled' | 'error' | 'failure';
  trackingNumber?: string;
  trackingUrl?: string;
  trackingCompany?: string;
  lineItems: { lineItemId: string; quantity: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimelineEvent {
  id: string;
  type: 'created' | 'confirmed' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'note' | 'edited';
  message: string;
  createdAt: string;
  createdBy?: string;
  details?: Record<string, unknown>;
}

export interface OrderNote {
  id: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'partially_refunded' | 'voided';
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';

export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  customer: OrderCustomer;
  email: string;
  phone?: string;
  billingAddress: OrderAddress;
  shippingAddress: OrderAddress;
  lineItems: OrderLineItem[];
  subtotalPrice: number;
  totalDiscounts: number;
  totalShipping: number;
  totalTax: number;
  totalPrice: number;
  currency: string;
  discounts: OrderDiscount[];
  shipping: OrderShipping;
  payment: OrderPayment;
  refunds: OrderRefund[];
  fulfillments: OrderFulfillment[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  notes: OrderNote[];
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  cancelledAt?: string;
  closedAt?: string;
  cancelReason?: string;
}

export interface CreateOrderInput {
  customerId?: string;
  email: string;
  phone?: string;
  billingAddress: OrderAddress;
  shippingAddress: OrderAddress;
  lineItems: {
    productId: string;
    variantId: string;
    quantity: number;
    price?: number;
  }[];
  discountCodes?: string[];
  shippingMethod: string;
  note?: string;
  tags?: string[];
  sendReceipt?: boolean;
}

export interface UpdateOrderInput {
  id: string;
  email?: string;
  phone?: string;
  billingAddress?: Partial<OrderAddress>;
  shippingAddress?: Partial<OrderAddress>;
  note?: string;
  tags?: string[];
}

export interface OrderFilters {
  status?: OrderStatus | '';
  paymentStatus?: PaymentStatus | '';
  fulfillmentStatus?: FulfillmentStatus | '';
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  search?: string;
  minTotal?: number;
  maxTotal?: number;
  tags?: string[];
}

export interface OrderSortOptions {
  field: 'orderNumber' | 'createdAt' | 'totalPrice' | 'status';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
}

export interface FulfillOrderInput {
  lineItems: { lineItemId: string; quantity: number }[];
  trackingNumber?: string;
  trackingUrl?: string;
  trackingCompany?: string;
  notifyCustomer?: boolean;
}

export interface RefundOrderInput {
  amount: number;
  reason: string;
  note?: string;
  lineItems?: { lineItemId: string; quantity: number }[];
  restock?: boolean;
  notifyCustomer?: boolean;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const ORDERS_ENDPOINT = `${API_BASE_URL}/orders`;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// =============================================================================
// ORDERS API FUNCTIONS
// =============================================================================

/**
 * Fetch orders with optional filters, sorting, and pagination
 */
export async function getOrders(
  filters?: OrderFilters,
  sort?: OrderSortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Order>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ORDERS_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<Order>>(response);
}

/**
 * Fetch a single order by ID
 */
export async function getOrder(id: string): Promise<Order> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Order>(response);
}

/**
 * Create a new order
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Order>(response);
}

/**
 * Update an existing order
 */
export async function updateOrder(input: UpdateOrderInput): Promise<Order> {
  const { id, ...data } = input;

  const response = await fetch(`${ORDERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Order>(response);
}

// =============================================================================
// ORDER FULFILLMENT API FUNCTIONS
// =============================================================================

/**
 * Fulfill an order or part of an order
 */
export async function fulfillOrder(
  orderId: string,
  input: FulfillOrderInput
): Promise<OrderFulfillment> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/fulfill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<OrderFulfillment>(response);
}

/**
 * Update fulfillment tracking information
 */
export async function updateFulfillmentTracking(
  orderId: string,
  fulfillmentId: string,
  tracking: {
    trackingNumber?: string;
    trackingUrl?: string;
    trackingCompany?: string;
  }
): Promise<OrderFulfillment> {
  const response = await fetch(
    `${ORDERS_ENDPOINT}/${orderId}/fulfillments/${fulfillmentId}/tracking`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tracking),
    }
  );

  return handleResponse<OrderFulfillment>(response);
}

/**
 * Cancel a fulfillment
 */
export async function cancelFulfillment(
  orderId: string,
  fulfillmentId: string
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${ORDERS_ENDPOINT}/${orderId}/fulfillments/${fulfillmentId}/cancel`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// ORDER CANCELLATION & REFUND API FUNCTIONS
// =============================================================================

/**
 * Cancel an order
 */
export async function cancelOrder(
  id: string,
  reason?: string,
  notifyCustomer?: boolean
): Promise<Order> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason, notifyCustomer }),
  });

  return handleResponse<Order>(response);
}

/**
 * Refund an order or part of an order
 */
export async function refundOrder(
  orderId: string,
  input: RefundOrderInput
): Promise<OrderRefund> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<OrderRefund>(response);
}

// =============================================================================
// ORDER TIMELINE & NOTES API FUNCTIONS
// =============================================================================

/**
 * Get order timeline events
 */
export async function getOrderTimeline(orderId: string): Promise<OrderTimelineEvent[]> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/timeline`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<OrderTimelineEvent[]>(response);
}

/**
 * Add a note to an order
 */
export async function addOrderNote(
  orderId: string,
  content: string,
  isPrivate: boolean = false
): Promise<OrderNote> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, isPrivate }),
  });

  return handleResponse<OrderNote>(response);
}

/**
 * Delete an order note
 */
export async function deleteOrderNote(
  orderId: string,
  noteId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// ORDER STATS & UTILITIES
// =============================================================================

/**
 * Get order statistics
 */
export async function getOrderStats(dateRange?: { from: string; to: string }): Promise<OrderStats> {
  const params = dateRange ? { dateFrom: dateRange.from, dateTo: dateRange.to } : {};
  const queryString = buildQueryString(params);

  const response = await fetch(`${ORDERS_ENDPOINT}/stats${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<OrderStats>(response);
}

/**
 * Search orders by query
 */
export async function searchOrders(query: string, limit?: number): Promise<Order[]> {
  const params = { search: query, limit: limit || 10 };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ORDERS_ENDPOINT}/search${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Order[]>(response);
}

/**
 * Export orders to file
 */
export async function exportOrders(
  filters?: OrderFilters,
  format: 'csv' | 'xlsx' | 'pdf' = 'csv'
): Promise<Blob> {
  const params = { ...filters, format };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ORDERS_ENDPOINT}/export${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }

  return response.blob();
}

/**
 * Resend order confirmation email
 */
export async function resendOrderConfirmation(orderId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/resend-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Print order packing slip
 */
export async function getPackingSlip(orderId: string): Promise<Blob> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/packing-slip`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get packing slip: ${response.status}`);
  }

  return response.blob();
}

/**
 * Print order invoice
 */
export async function getInvoice(orderId: string): Promise<Blob> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/invoice`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get invoice: ${response.status}`);
  }

  return response.blob();
}

/**
 * Mark order as paid
 */
export async function markOrderAsPaid(
  orderId: string,
  paymentDetails?: { transactionId?: string; gateway?: string }
): Promise<Order> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/mark-paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentDetails),
  });

  return handleResponse<Order>(response);
}

/**
 * Archive an order
 */
export async function archiveOrder(orderId: string): Promise<Order> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/archive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Order>(response);
}

/**
 * Unarchive an order
 */
export async function unarchiveOrder(orderId: string): Promise<Order> {
  const response = await fetch(`${ORDERS_ENDPOINT}/${orderId}/unarchive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Order>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const ordersApi = {
  // Orders
  getOrders,
  getOrder,
  createOrder,
  updateOrder,

  // Fulfillment
  fulfillOrder,
  updateFulfillmentTracking,
  cancelFulfillment,

  // Cancellation & Refund
  cancelOrder,
  refundOrder,

  // Timeline & Notes
  getOrderTimeline,
  addOrderNote,
  deleteOrderNote,

  // Stats & Utilities
  getOrderStats,
  searchOrders,
  exportOrders,
  resendOrderConfirmation,
  getPackingSlip,
  getInvoice,
  markOrderAsPaid,
  archiveOrder,
  unarchiveOrder,
};

export default ordersApi;
