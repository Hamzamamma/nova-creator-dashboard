/**
 * Collections API Service
 * Handles all collection-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface CollectionCondition {
  field: 'title' | 'type' | 'vendor' | 'tag' | 'price' | 'compare_at_price' | 'weight' | 'inventory_stock' | 'variant_title';
  relation: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with' | 'contains' | 'not_contains';
  value: string;
}

export interface CollectionRule {
  conditions: CollectionCondition[];
  disjunctive: boolean; // true = OR, false = AND
}

export interface CollectionSEO {
  metaTitle: string;
  metaDescription: string;
  urlHandle: string;
}

export interface CollectionImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export type CollectionSortOrder =
  | 'alpha-asc'
  | 'alpha-desc'
  | 'best-selling'
  | 'created-asc'
  | 'created-desc'
  | 'price-asc'
  | 'price-desc'
  | 'manual';

export interface Collection {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  image?: CollectionImage;
  type: 'manual' | 'smart';
  rules?: CollectionRule;
  sortOrder: CollectionSortOrder;
  productsCount: number;
  productIds: string[];
  seo: CollectionSEO;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionInput {
  title: string;
  description?: string;
  descriptionHtml?: string;
  type: 'manual' | 'smart';
  rules?: CollectionRule;
  sortOrder?: CollectionSortOrder;
  productIds?: string[];
  seo?: Partial<CollectionSEO>;
  image?: File | string;
  published?: boolean;
}

export interface UpdateCollectionInput {
  id: string;
  title?: string;
  description?: string;
  descriptionHtml?: string;
  rules?: CollectionRule;
  sortOrder?: CollectionSortOrder;
  seo?: Partial<CollectionSEO>;
  image?: File | string;
  published?: boolean;
}

export interface CollectionFilters {
  type?: 'manual' | 'smart' | '';
  search?: string;
  published?: boolean;
}

export interface CollectionSortOptions {
  field: 'title' | 'productsCount' | 'createdAt' | 'updatedAt';
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

export interface CollectionProduct {
  id: string;
  title: string;
  sku: string;
  price: number;
  imageUrl?: string;
  status: 'active' | 'draft' | 'archived';
  quantity: number;
  position: number;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const COLLECTIONS_ENDPOINT = `${API_BASE_URL}/collections`;

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
// COLLECTIONS API FUNCTIONS
// =============================================================================

/**
 * Fetch collections with optional filters, sorting, and pagination
 */
export async function getCollections(
  filters?: CollectionFilters,
  sort?: CollectionSortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Collection>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${COLLECTIONS_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<Collection>>(response);
}

/**
 * Fetch a single collection by ID
 */
export async function getCollection(id: string): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Collection>(response);
}

/**
 * Create a new collection
 */
export async function createCollection(input: CreateCollectionInput): Promise<Collection> {
  const formData = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await fetch(COLLECTIONS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<Collection>(response);
}

/**
 * Update an existing collection
 */
export async function updateCollection(input: UpdateCollectionInput): Promise<Collection> {
  const { id, ...data } = input;
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: formData,
  });

  return handleResponse<Collection>(response);
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// COLLECTION PRODUCTS API FUNCTIONS
// =============================================================================

/**
 * Get products in a collection
 */
export async function getCollectionProducts(
  collectionId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<CollectionProduct>> {
  const params = {
    page: pagination?.page || 1,
    limit: pagination?.limit || 50,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${collectionId}/products${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<CollectionProduct>>(response);
}

/**
 * Add products to a manual collection
 */
export async function addProductsToCollection(
  collectionId: string,
  productIds: string[]
): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${collectionId}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds }),
  });

  return handleResponse<Collection>(response);
}

/**
 * Remove products from a manual collection
 */
export async function removeProductsFromCollection(
  collectionId: string,
  productIds: string[]
): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${collectionId}/products`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds }),
  });

  return handleResponse<Collection>(response);
}

/**
 * Reorder products in a manual collection
 */
export async function reorderCollectionProducts(
  collectionId: string,
  productIds: string[]
): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${collectionId}/products/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds }),
  });

  return handleResponse<Collection>(response);
}

// =============================================================================
// COLLECTION UTILITIES
// =============================================================================

/**
 * Search collections
 */
export async function searchCollections(query: string, limit?: number): Promise<Collection[]> {
  const params = { search: query, limit: limit || 10 };
  const queryString = buildQueryString(params);

  const response = await fetch(`${COLLECTIONS_ENDPOINT}/search${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Collection[]>(response);
}

/**
 * Publish a collection
 */
export async function publishCollection(id: string): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Collection>(response);
}

/**
 * Unpublish a collection
 */
export async function unpublishCollection(id: string): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}/unpublish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Collection>(response);
}

/**
 * Duplicate a collection
 */
export async function duplicateCollection(id: string): Promise<Collection> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/${id}/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Collection>(response);
}

/**
 * Preview smart collection products (before saving)
 */
export async function previewSmartCollection(
  rules: CollectionRule,
  limit?: number
): Promise<CollectionProduct[]> {
  const response = await fetch(`${COLLECTIONS_ENDPOINT}/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rules, limit: limit || 10 }),
  });

  return handleResponse<CollectionProduct[]>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const collectionsApi = {
  // Collections
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,

  // Collection Products
  getCollectionProducts,
  addProductsToCollection,
  removeProductsFromCollection,
  reorderCollectionProducts,

  // Utilities
  searchCollections,
  publishCollection,
  unpublishCollection,
  duplicateCollection,
  previewSmartCollection,
};

export default collectionsApi;
