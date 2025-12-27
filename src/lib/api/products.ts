/**
 * Products API Service
 * Handles all product-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ProductVariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  quantity: number;
  options: ProductVariantOption[];
  imageUrl: string | null;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  width?: number;
  height?: number;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  urlHandle: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  category: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: number;
  variants: ProductVariant[];
  images: ProductImage[];
  featuredImage: string | null;
  seo: ProductSEO;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  collections?: string[];
}

export interface CreateProductInput {
  title: string;
  description?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  category?: string;
  tags?: string[];
  status?: 'active' | 'draft' | 'archived';
  price: number;
  compareAtPrice?: number | null;
  costPerItem?: number | null;
  sku?: string;
  barcode?: string;
  trackQuantity?: boolean;
  quantity?: number;
  variants?: Partial<ProductVariant>[];
  images?: Partial<ProductImage>[];
  seo?: Partial<ProductSEO>;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface ProductFilters {
  status?: 'active' | 'draft' | 'archived' | '';
  category?: string;
  vendor?: string;
  priceMin?: number;
  priceMax?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | '';
  search?: string;
  tags?: string[];
  collection?: string;
}

export interface ProductSortOptions {
  field: 'title' | 'price' | 'quantity' | 'createdAt' | 'updatedAt';
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

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

export interface BulkActionResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: { id: string; error: string }[];
}

export interface ImageUploadResult {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

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
// PRODUCTS API FUNCTIONS
// =============================================================================

/**
 * Fetch products with optional filters, sorting, and pagination
 */
export async function getProducts(
  filters?: ProductFilters,
  sort?: ProductSortOptions,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Product>> {
  const params = {
    ...filters,
    sortField: sort?.field,
    sortDirection: sort?.direction,
    page: pagination?.page || 1,
    limit: pagination?.limit || 20,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${PRODUCTS_ENDPOINT}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PaginatedResponse<Product>>(response);
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Product>(response);
}

/**
 * Create a new product
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Product>(response);
}

/**
 * Update an existing product
 */
export async function updateProduct(input: UpdateProductInput): Promise<Product> {
  const { id, ...data } = input;

  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Product>(response);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(ids: string[]): Promise<BulkActionResult> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });

  return handleResponse<BulkActionResult>(response);
}

/**
 * Bulk update product status
 */
export async function bulkUpdateProductStatus(
  ids: string[],
  status: 'active' | 'draft' | 'archived'
): Promise<BulkActionResult> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/bulk-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids, status }),
  });

  return handleResponse<BulkActionResult>(response);
}

// =============================================================================
// PRODUCT VARIANTS API FUNCTIONS
// =============================================================================

/**
 * Get variants for a product
 */
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/variants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ProductVariant[]>(response);
}

/**
 * Create a new variant for a product
 */
export async function createVariant(
  productId: string,
  variant: Partial<ProductVariant>
): Promise<ProductVariant> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/variants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variant),
  });

  return handleResponse<ProductVariant>(response);
}

/**
 * Update a product variant
 */
export async function updateVariant(
  productId: string,
  variantId: string,
  variant: Partial<ProductVariant>
): Promise<ProductVariant> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/variants/${variantId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variant),
  });

  return handleResponse<ProductVariant>(response);
}

/**
 * Delete a product variant
 */
export async function deleteVariant(
  productId: string,
  variantId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/variants/${variantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// PRODUCT IMAGES API FUNCTIONS
// =============================================================================

/**
 * Upload a product image
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  alt?: string
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append('image', file);
  if (alt) {
    formData.append('alt', alt);
  }

  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/images`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<ImageUploadResult>(response);
}

/**
 * Update image metadata
 */
export async function updateProductImage(
  productId: string,
  imageId: string,
  data: { alt?: string; position?: number }
): Promise<ProductImage> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/images/${imageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<ProductImage>(response);
}

/**
 * Delete a product image
 */
export async function deleteProductImage(
  productId: string,
  imageId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

/**
 * Reorder product images
 */
export async function reorderProductImages(
  productId: string,
  imageIds: string[]
): Promise<ProductImage[]> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/images/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageIds }),
  });

  return handleResponse<ProductImage[]>(response);
}

// =============================================================================
// PRODUCT STATS & UTILITIES
// =============================================================================

/**
 * Get product statistics
 */
export async function getProductStats(): Promise<ProductStats> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ProductStats>(response);
}

/**
 * Search products by query
 */
export async function searchProducts(
  query: string,
  limit?: number
): Promise<Product[]> {
  const params = { search: query, limit: limit || 10 };
  const queryString = buildQueryString(params);

  const response = await fetch(`${PRODUCTS_ENDPOINT}/search${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Product[]>(response);
}

/**
 * Get product categories
 */
export async function getProductCategories(): Promise<string[]> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<string[]>(response);
}

/**
 * Get product vendors
 */
export async function getProductVendors(): Promise<string[]> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/vendors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<string[]>(response);
}

/**
 * Duplicate a product
 */
export async function duplicateProduct(id: string): Promise<Product> {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Product>(response);
}

/**
 * Export products to CSV
 */
export async function exportProducts(
  filters?: ProductFilters,
  format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> {
  const params = { ...filters, format };
  const queryString = buildQueryString(params);

  const response = await fetch(`${PRODUCTS_ENDPOINT}/export${queryString}`, {
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
 * Import products from file
 */
export async function importProducts(file: File): Promise<BulkActionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${PRODUCTS_ENDPOINT}/import`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<BulkActionResult>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const productsApi = {
  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProductStatus,

  // Variants
  getProductVariants,
  createVariant,
  updateVariant,
  deleteVariant,

  // Images
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,

  // Stats & Utilities
  getProductStats,
  searchProducts,
  getProductCategories,
  getProductVendors,
  duplicateProduct,
  exportProducts,
  importProducts,
};

export default productsApi;
