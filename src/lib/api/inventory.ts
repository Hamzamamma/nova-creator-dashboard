/**
 * Inventory API Service
 * Handles all inventory-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface InventoryLocation {
  id: string;
  name: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLevel {
  id: string;
  locationId: string;
  locationName: string;
  productId: string;
  variantId: string;
  sku: string;
  available: number;
  incoming: number;
  committed: number;
  onHand: number;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  barcode?: string;
  imageUrl?: string;
  tracked: boolean;
  cost?: number;
  countryCodeOfOrigin?: string;
  harmonizedSystemCode?: string;
  levels: InventoryLevel[];
  totalAvailable: number;
  totalOnHand: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  inventoryItemId: string;
  locationId: string;
  delta: number;
  reason: InventoryAdjustmentReason;
  note?: string;
  createdBy: string;
  createdAt: string;
}

export type InventoryAdjustmentReason =
  | 'received'
  | 'correction'
  | 'damaged'
  | 'theft'
  | 'loss'
  | 'returned'
  | 'recount'
  | 'other';

export interface InventoryTransfer {
  id: string;
  sourceLocationId: string;
  sourceLocationName: string;
  destinationLocationId: string;
  destinationLocationName: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  items: {
    inventoryItemId: string;
    sku: string;
    productTitle: string;
    quantity: number;
    receivedQuantity?: number;
  }[];
  expectedDelivery?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryFilters {
  locationId?: string;
  search?: string;
  tracked?: boolean;
  lowStock?: boolean;
  outOfStock?: boolean;
  productId?: string;
}

export interface InventorySortOptions {
  field: 'sku' | 'productTitle' | 'available' | 'onHand' | 'updatedAt';
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

export interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  totalAvailable: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  locationBreakdown: {
    locationId: string;
    locationName: string;
    available: number;
    value: number;
  }[];
}

export interface AdjustInventoryInput {
  inventoryItemId: string;
  locationId: string;
  delta: number;
  reason: InventoryAdjustmentReason;
  note?: string;
}

export interface SetInventoryInput {
  inventoryItemId: string;
  locationId: string;
  available: number;
  reason?: string;
}

export interface CreateTransferInput {
  sourceLocationId: string;
  destinationLocationId: string;
  items: { inventoryItemId: string; quantity: number }[];
  expectedDelivery?: string;
  notes?: string;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const INVENTORY_ENDPOINT = `${API_BASE_URL}/inventory`;
const LOCATIONS_ENDPOINT = `${API_BASE_URL}/locations`;

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
      if (typeof value === 'boolean') {
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
// INVENTORY API FUNCTIONS
// =============================================================================

/**
 * Fetch inventory items with optional filters, sorting, and pagination
 */
export async function getInventory(
  filters?: InventoryFilters,
  sort?: InventorySortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<InventoryItem>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 50,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${INVENTORY_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<InventoryItem>>(response);
}

/**
 * Get a single inventory item
 */
export async function getInventoryItem(id: string): Promise<InventoryItem> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<InventoryItem>(response);
}

/**
 * Adjust inventory level (add or subtract)
 */
export async function adjustInventory(input: AdjustInventoryInput): Promise<InventoryLevel> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/adjust`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<InventoryLevel>(response);
}

/**
 * Set inventory level to a specific value
 */
export async function setInventory(input: SetInventoryInput): Promise<InventoryLevel> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<InventoryLevel>(response);
}

/**
 * Bulk adjust inventory levels
 */
export async function bulkAdjustInventory(
  adjustments: AdjustInventoryInput[]
): Promise<{ success: number; failed: number; errors?: { sku: string; error: string }[] }> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/bulk-adjust`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adjustments }),
  });

  return handleResponse<{ success: number; failed: number; errors?: { sku: string; error: string }[] }>(response);
}

/**
 * Get inventory history/adjustments for an item
 */
export async function getInventoryHistory(
  inventoryItemId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<InventoryAdjustment>> {
  const params = {
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${INVENTORY_ENDPOINT}/${inventoryItemId}/history${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<InventoryAdjustment>>(response);
}

// =============================================================================
// LOCATIONS API FUNCTIONS
// =============================================================================

/**
 * Get all inventory locations
 */
export async function getLocations(): Promise<InventoryLocation[]> {
  const response = await fetch(LOCATIONS_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<InventoryLocation[]>(response);
}

/**
 * Get a single location
 */
export async function getLocation(id: string): Promise<InventoryLocation> {
  const response = await fetch(`${LOCATIONS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<InventoryLocation>(response);
}

/**
 * Create a new location
 */
export async function createLocation(
  input: Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<InventoryLocation> {
  const response = await fetch(LOCATIONS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<InventoryLocation>(response);
}

/**
 * Update a location
 */
export async function updateLocation(
  id: string,
  input: Partial<InventoryLocation>
): Promise<InventoryLocation> {
  const response = await fetch(`${LOCATIONS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<InventoryLocation>(response);
}

/**
 * Delete a location
 */
export async function deleteLocation(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${LOCATIONS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// TRANSFERS API FUNCTIONS
// =============================================================================

/**
 * Get inventory transfers
 */
export async function getTransfers(
  status?: InventoryTransfer['status'],
  pagination?: PaginationParams
): Promise<PaginatedResponse<InventoryTransfer>> {
  const params = {
    status,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${INVENTORY_ENDPOINT}/transfers${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<InventoryTransfer>>(response);
}

/**
 * Create a transfer
 */
export async function createTransfer(input: CreateTransferInput): Promise<InventoryTransfer> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<InventoryTransfer>(response);
}

/**
 * Complete a transfer
 */
export async function completeTransfer(
  transferId: string,
  receivedItems?: { inventoryItemId: string; receivedQuantity: number }[]
): Promise<InventoryTransfer> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/transfers/${transferId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ receivedItems }),
  });

  return handleResponse<InventoryTransfer>(response);
}

/**
 * Cancel a transfer
 */
export async function cancelTransfer(transferId: string): Promise<InventoryTransfer> {
  const response = await fetch(`${INVENTORY_ENDPOINT}/transfers/${transferId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<InventoryTransfer>(response);
}

// =============================================================================
// INVENTORY STATS & UTILITIES
// =============================================================================

/**
 * Get inventory statistics
 */
export async function getInventoryStats(locationId?: string): Promise<InventoryStats> {
  const params = locationId ? { locationId } : {};
  const queryString = buildQueryString(params);

  const response = await fetch(`${INVENTORY_ENDPOINT}/stats${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<InventoryStats>(response);
}

/**
 * Export inventory to file
 */
export async function exportInventory(
  filters?: InventoryFilters,
  format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
  const params = { ...filters, format };
  const queryString = buildQueryString(params);

  const response = await fetch(`${INVENTORY_ENDPOINT}/export${queryString}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }

  return response.blob();
}

/**
 * Import inventory from file
 */
export async function importInventory(
  file: File,
  locationId: string
): Promise<{ success: number; failed: number; errors?: { row: number; error: string }[] }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('locationId', locationId);

  const response = await fetch(`${INVENTORY_ENDPOINT}/import`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<{ success: number; failed: number; errors?: { row: number; error: string }[] }>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const inventoryApi = {
  // Inventory
  getInventory,
  getInventoryItem,
  adjustInventory,
  setInventory,
  bulkAdjustInventory,
  getInventoryHistory,

  // Locations
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,

  // Transfers
  getTransfers,
  createTransfer,
  completeTransfer,
  cancelTransfer,

  // Stats & Utilities
  getInventoryStats,
  exportInventory,
  importInventory,
};

export default inventoryApi;
