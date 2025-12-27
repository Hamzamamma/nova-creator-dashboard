/**
 * Discounts API Service
 * Handles all discount-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
export type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'disabled';
export type DiscountTarget = 'all' | 'products' | 'collections' | 'customer_segments';
export type DiscountAllocation = 'each' | 'across';

export interface DiscountCondition {
  type: 'min_quantity' | 'min_purchase' | 'customer_segment' | 'first_purchase' | 'products' | 'collections';
  value: string | number | string[];
}

export interface BuyXGetYConfig {
  buyQuantity: number;
  buyProducts?: string[];
  buyCollections?: string[];
  getQuantity: number;
  getProducts?: string[];
  getCollections?: string[];
  getDiscountType: 'percentage' | 'free';
  getDiscountValue?: number;
}

export interface DiscountUsageLimits {
  totalUsageLimit?: number;
  perCustomerLimit?: number;
  oncePerCustomer: boolean;
}

export interface DiscountDateRange {
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface Discount {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  target: DiscountTarget;
  targetIds?: string[];
  allocation: DiscountAllocation;
  conditions: DiscountCondition[];
  buyXGetY?: BuyXGetYConfig;
  usageLimits: DiscountUsageLimits;
  dateRange: DiscountDateRange;
  status: DiscountStatus;
  usageCount: number;
  totalDiscountedAmount: number;
  ordersCount: number;
  averageOrderValue: number;
  combinesWith: {
    productDiscounts: boolean;
    orderDiscounts: boolean;
    shippingDiscounts: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountInput {
  code: string;
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  target?: DiscountTarget;
  targetIds?: string[];
  allocation?: DiscountAllocation;
  conditions?: DiscountCondition[];
  buyXGetY?: BuyXGetYConfig;
  usageLimits?: Partial<DiscountUsageLimits>;
  dateRange: DiscountDateRange;
  combinesWith?: Partial<Discount['combinesWith']>;
}

export interface UpdateDiscountInput {
  id: string;
  code?: string;
  title?: string;
  description?: string;
  value?: number;
  target?: DiscountTarget;
  targetIds?: string[];
  allocation?: DiscountAllocation;
  conditions?: DiscountCondition[];
  buyXGetY?: BuyXGetYConfig;
  usageLimits?: Partial<DiscountUsageLimits>;
  dateRange?: Partial<DiscountDateRange>;
  status?: DiscountStatus;
  combinesWith?: Partial<Discount['combinesWith']>;
}

export interface DiscountFilters {
  status?: DiscountStatus | '';
  type?: DiscountType | '';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DiscountSortOptions {
  field: 'code' | 'title' | 'usageCount' | 'createdAt' | 'status';
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

export interface DiscountStats {
  totalDiscounts: number;
  activeDiscounts: number;
  scheduledDiscounts: number;
  expiredDiscounts: number;
  totalUsage: number;
  totalDiscountedAmount: number;
  averageDiscountValue: number;
}

export interface DiscountUsage {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  discountAmount: number;
  orderTotal: number;
  usedAt: string;
}

export interface DiscountPerformance {
  discount: Discount;
  dailyUsage: { date: string; count: number; amount: number }[];
  topProducts: { productId: string; productName: string; usageCount: number }[];
  customerSegments: { segment: string; usageCount: number; percentage: number }[];
  conversionRate: number;
  revenueGenerated: number;
  roi: number;
}

export interface ValidateDiscountResult {
  valid: boolean;
  discount?: Discount;
  discountAmount?: number;
  message?: string;
  errors?: string[];
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const DISCOUNTS_ENDPOINT = `${API_BASE_URL}/discounts`;

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
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// =============================================================================
// DISCOUNTS API FUNCTIONS
// =============================================================================

/**
 * Fetch discounts with optional filters, sorting, and pagination
 */
export async function getDiscounts(
  filters?: DiscountFilters,
  sort?: DiscountSortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Discount>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${DISCOUNTS_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<Discount>>(response);
}

/**
 * Fetch a single discount by ID
 */
export async function getDiscount(id: string): Promise<Discount> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Discount>(response);
}

/**
 * Create a new discount
 */
export async function createDiscount(input: CreateDiscountInput): Promise<Discount> {
  const response = await fetch(DISCOUNTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Discount>(response);
}

/**
 * Update an existing discount
 */
export async function updateDiscount(input: UpdateDiscountInput): Promise<Discount> {
  const { id, ...data } = input;

  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Discount>(response);
}

/**
 * Delete a discount
 */
export async function deleteDiscount(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Activate a discount
 */
export async function activateDiscount(id: string): Promise<Discount> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Discount>(response);
}

/**
 * Deactivate a discount
 */
export async function deactivateDiscount(id: string): Promise<Discount> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Discount>(response);
}

// =============================================================================
// DISCOUNT VALIDATION API FUNCTIONS
// =============================================================================

/**
 * Validate a discount code
 */
export async function validateDiscountCode(
  code: string,
  cartData?: {
    customerId?: string;
    lineItems: { productId: string; variantId: string; quantity: number; price: number }[];
    subtotal: number;
  }
): Promise<ValidateDiscountResult> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, cart: cartData }),
  });

  return handleResponse<ValidateDiscountResult>(response);
}

/**
 * Check if a discount code is available
 */
export async function checkDiscountCodeAvailability(code: string): Promise<{ available: boolean }> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/check-code?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ available: boolean }>(response);
}

/**
 * Generate a unique discount code
 */
export async function generateDiscountCode(
  prefix?: string,
  length?: number
): Promise<{ code: string }> {
  const params = { prefix, length };
  const queryString = buildQueryString(params);

  const response = await fetch(`${DISCOUNTS_ENDPOINT}/generate-code${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ code: string }>(response);
}

// =============================================================================
// DISCOUNT USAGE & ANALYTICS API FUNCTIONS
// =============================================================================

/**
 * Get discount usage history
 */
export async function getDiscountUsage(
  discountId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<DiscountUsage>> {
  const params = {
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${discountId}/usage${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<DiscountUsage>>(response);
}

/**
 * Get discount performance analytics
 */
export async function getDiscountPerformance(
  discountId: string,
  dateRange?: { from: string; to: string }
): Promise<DiscountPerformance> {
  const params = dateRange ? { dateFrom: dateRange.from, dateTo: dateRange.to } : {};
  const queryString = buildQueryString(params);

  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${discountId}/performance${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<DiscountPerformance>(response);
}

/**
 * Get overall discount statistics
 */
export async function getDiscountStats(
  dateRange?: { from: string; to: string }
): Promise<DiscountStats> {
  const params = dateRange ? { dateFrom: dateRange.from, dateTo: dateRange.to } : {};
  const queryString = buildQueryString(params);

  const response = await fetch(`${DISCOUNTS_ENDPOINT}/stats${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<DiscountStats>(response);
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Bulk create discount codes
 */
export async function bulkCreateDiscounts(
  baseDiscount: Omit<CreateDiscountInput, 'code'>,
  codes: string[]
): Promise<{ created: number; failed: number; errors?: { code: string; error: string }[] }> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/bulk-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ baseDiscount, codes }),
  });

  return handleResponse<{ created: number; failed: number; errors?: { code: string; error: string }[] }>(response);
}

/**
 * Bulk delete discounts
 */
export async function bulkDeleteDiscounts(
  ids: string[]
): Promise<{ deleted: number; failed: number }> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });

  return handleResponse<{ deleted: number; failed: number }>(response);
}

/**
 * Bulk update discount status
 */
export async function bulkUpdateDiscountStatus(
  ids: string[],
  status: 'active' | 'disabled'
): Promise<{ updated: number; failed: number }> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/bulk-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids, status }),
  });

  return handleResponse<{ updated: number; failed: number }>(response);
}

/**
 * Duplicate a discount
 */
export async function duplicateDiscount(id: string, newCode?: string): Promise<Discount> {
  const response = await fetch(`${DISCOUNTS_ENDPOINT}/${id}/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newCode }),
  });

  return handleResponse<Discount>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const discountsApi = {
  // Discounts
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  activateDiscount,
  deactivateDiscount,

  // Validation
  validateDiscountCode,
  checkDiscountCodeAvailability,
  generateDiscountCode,

  // Usage & Analytics
  getDiscountUsage,
  getDiscountPerformance,
  getDiscountStats,

  // Bulk Operations
  bulkCreateDiscounts,
  bulkDeleteDiscounts,
  bulkUpdateDiscountStatus,
  duplicateDiscount,
};

export default discountsApi;
