/**
 * Customers API Service
 * Handles all customer-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface CustomerAddress {
  id: string;
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
  isDefault: boolean;
}

export interface CustomerMetadata {
  acceptsMarketing: boolean;
  marketingOptInAt?: string;
  tags: string[];
  note?: string;
  locale?: string;
  taxExempt: boolean;
  taxExemptions?: string[];
}

export interface CustomerStats {
  ordersCount: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  lastOrderAmount?: number;
  lifetimeValue: number;
}

export type CustomerSegment = 'vip' | 'regular' | 'new' | 'at-risk' | 'churned' | 'inactive';
export type CustomerState = 'enabled' | 'disabled' | 'invited' | 'declined';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  state: CustomerState;
  segment: CustomerSegment;
  defaultAddress?: CustomerAddress;
  addresses: CustomerAddress[];
  metadata: CustomerMetadata;
  stats: CustomerStats;
  verifiedEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password?: string;
  acceptsMarketing?: boolean;
  tags?: string[];
  note?: string;
  addresses?: Omit<CustomerAddress, 'id'>[];
  sendWelcomeEmail?: boolean;
  taxExempt?: boolean;
}

export interface UpdateCustomerInput {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  tags?: string[];
  note?: string;
  taxExempt?: boolean;
  state?: CustomerState;
}

export interface CustomerFilters {
  segment?: CustomerSegment | '';
  state?: CustomerState | '';
  acceptsMarketing?: boolean;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  minOrderCount?: number;
  maxOrderCount?: number;
  minTotalSpent?: number;
  maxTotalSpent?: number;
}

export interface CustomerSortOptions {
  field: 'name' | 'email' | 'createdAt' | 'ordersCount' | 'totalSpent';
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

export interface CustomerOverviewStats {
  totalCustomers: number;
  newCustomers: number;
  newCustomersChange: number;
  returningCustomers: number;
  vipCustomers: number;
  atRiskCustomers: number;
  averageLifetimeValue: number;
  averageOrderValue: number;
  repeatPurchaseRate: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalPrice: number;
  itemsCount: number;
}

export interface BulkActionResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: { id: string; error: string }[];
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/customers`;

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
      } else if (typeof value === 'boolean') {
        searchParams.append(key, value ? 'true' : 'false');
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// =============================================================================
// CUSTOMERS API FUNCTIONS
// =============================================================================

/**
 * Fetch customers with optional filters, sorting, and pagination
 */
export async function getCustomers(
  filters?: CustomerFilters,
  sort?: CustomerSortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Customer>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${CUSTOMERS_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<Customer>>(response);
}

/**
 * Fetch a single customer by ID
 */
export async function getCustomer(id: string): Promise<Customer> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Customer>(response);
}

/**
 * Create a new customer
 */
export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const response = await fetch(CUSTOMERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Customer>(response);
}

/**
 * Update an existing customer
 */
export async function updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
  const { id, ...data } = input;

  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Customer>(response);
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// CUSTOMER ORDERS API FUNCTIONS
// =============================================================================

/**
 * Get orders for a specific customer
 */
export async function getCustomerOrders(
  customerId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<CustomerOrder>> {
  const params = {
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/orders${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<CustomerOrder>>(response);
}

/**
 * Get statistics for a specific customer
 */
export async function getCustomerStats(customerId: string): Promise<CustomerStats> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<CustomerStats>(response);
}

// =============================================================================
// CUSTOMER ADDRESS API FUNCTIONS
// =============================================================================

/**
 * Add a new address for a customer
 */
export async function addCustomerAddress(
  customerId: string,
  address: Omit<CustomerAddress, 'id'>
): Promise<CustomerAddress> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  return handleResponse<CustomerAddress>(response);
}

/**
 * Update a customer address
 */
export async function updateCustomerAddress(
  customerId: string,
  addressId: string,
  address: Partial<CustomerAddress>
): Promise<CustomerAddress> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/addresses/${addressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  return handleResponse<CustomerAddress>(response);
}

/**
 * Delete a customer address
 */
export async function deleteCustomerAddress(
  customerId: string,
  addressId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Set default address for a customer
 */
export async function setDefaultAddress(
  customerId: string,
  addressId: string
): Promise<Customer> {
  const response = await fetch(
    `${CUSTOMERS_ENDPOINT}/${customerId}/addresses/${addressId}/set-default`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return handleResponse<Customer>(response);
}

// =============================================================================
// CUSTOMER STATS & UTILITIES
// =============================================================================

/**
 * Get overview statistics for all customers
 */
export async function getCustomerOverviewStats(
  dateRange?: { from: string; to: string }
): Promise<CustomerOverviewStats> {
  const params = dateRange ? { dateFrom: dateRange.from, dateTo: dateRange.to } : {};
  const queryString = buildQueryString(params);

  const response = await fetch(`${CUSTOMERS_ENDPOINT}/stats${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<CustomerOverviewStats>(response);
}

/**
 * Search customers by query
 */
export async function searchCustomers(query: string, limit?: number): Promise<Customer[]> {
  const params = { search: query, limit: limit || 10 };
  const queryString = buildQueryString(params);

  const response = await fetch(`${CUSTOMERS_ENDPOINT}/search${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Customer[]>(response);
}

/**
 * Get customer segments with counts
 */
export async function getCustomerSegments(): Promise<{ segment: CustomerSegment; count: number }[]> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/segments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ segment: CustomerSegment; count: number }[]>(response);
}

/**
 * Export customers to file
 */
export async function exportCustomers(
  filters?: CustomerFilters,
  format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
  const params = { ...filters, format };
  const queryString = buildQueryString(params);

  const response = await fetch(`${CUSTOMERS_ENDPOINT}/export${queryString}`, {
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
 * Import customers from file
 */
export async function importCustomers(file: File): Promise<BulkActionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${CUSTOMERS_ENDPOINT}/import`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<BulkActionResult>(response);
}

/**
 * Send invite email to customer
 */
export async function sendCustomerInvite(customerId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/send-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Bulk update customer tags
 */
export async function bulkUpdateCustomerTags(
  customerIds: string[],
  tags: string[],
  action: 'add' | 'remove' | 'replace'
): Promise<BulkActionResult> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/bulk-tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerIds, tags, action }),
  });

  return handleResponse<BulkActionResult>(response);
}

/**
 * Merge duplicate customers
 */
export async function mergeCustomers(
  primaryCustomerId: string,
  secondaryCustomerIds: string[]
): Promise<Customer> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ primaryCustomerId, secondaryCustomerIds }),
  });

  return handleResponse<Customer>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const customersApi = {
  // Customers
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,

  // Customer Orders
  getCustomerOrders,
  getCustomerStats,

  // Customer Addresses
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,

  // Stats & Utilities
  getCustomerOverviewStats,
  searchCustomers,
  getCustomerSegments,
  exportCustomers,
  importCustomers,
  sendCustomerInvite,
  bulkUpdateCustomerTags,
  mergeCustomers,
};

export default customersApi;
