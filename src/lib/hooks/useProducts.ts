/**
 * Products Hooks
 * React hooks for managing product data and operations
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  productsApi,
  type Product,
  type ProductFilters,
  type ProductSortOptions,
  type PaginatedResponse,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductStats,
  type ProductVariant,
} from '../api/products';

// =============================================================================
// TYPES
// =============================================================================

interface UseProductsOptions {
  initialFilters?: ProductFilters;
  initialSort?: ProductSortOptions;
  initialPage?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseProductsResult {
  products: Product[];
  pagination: PaginatedResponse<Product>['pagination'] | null;
  loading: boolean;
  error: Error | null;
  filters: ProductFilters;
  sort: ProductSortOptions;
  setFilters: (filters: ProductFilters) => void;
  setSort: (sort: ProductSortOptions) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseProductMutationResult {
  create: (input: CreateProductInput) => Promise<Product>;
  update: (input: UpdateProductInput) => Promise<Product>;
  remove: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<Product>;
  loading: boolean;
  error: Error | null;
}

interface UseProductStatsResult {
  stats: ProductStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseProductSearchResult {
  results: Product[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

interface UseProductVariantsResult {
  variants: ProductVariant[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addVariant: (variant: Partial<ProductVariant>) => Promise<ProductVariant>;
  updateVariant: (variantId: string, variant: Partial<ProductVariant>) => Promise<ProductVariant>;
  removeVariant: (variantId: string) => Promise<void>;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_FILTERS: ProductFilters = {};
const DEFAULT_SORT: ProductSortOptions = { field: 'createdAt', direction: 'desc' };
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook for fetching and managing a list of products
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const {
    initialFilters = DEFAULT_FILTERS,
    initialSort = DEFAULT_SORT,
    initialPage = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    autoFetch = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);
  const [sort, setSortState] = useState<ProductSortOptions>(initialSort);
  const [page, setPageState] = useState(initialPage);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsApi.getProducts(filters, sort, { page, limit });
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(newFilters);
    setPageState(1); // Reset to first page on filter change
  }, []);

  const setSort = useCallback((newSort: ProductSortOptions) => {
    setSortState(newSort);
    setPageState(1); // Reset to first page on sort change
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const reset = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setSortState(DEFAULT_SORT);
    setPageState(DEFAULT_PAGE);
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    sort,
    setFilters,
    setSort,
    setPage,
    refetch: fetchProducts,
    reset,
  };
}

/**
 * Hook for fetching a single product by ID
 */
export function useProduct(id: string | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await productsApi.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

/**
 * Hook for product mutations (create, update, delete)
 */
export function useProductMutation(): UseProductMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (input: CreateProductInput): Promise<Product> => {
    setLoading(true);
    setError(null);

    try {
      const product = await productsApi.createProduct(input);
      return product;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create product');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (input: UpdateProductInput): Promise<Product> => {
    setLoading(true);
    setError(null);

    try {
      const product = await productsApi.updateProduct(input);
      return product;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update product');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await productsApi.deleteProduct(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete product');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicate = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);

    try {
      const product = await productsApi.duplicateProduct(id);
      return product;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to duplicate product');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    update,
    remove,
    duplicate,
    loading,
    error,
  };
}

/**
 * Hook for fetching product statistics
 */
export function useProductStats(): UseProductStatsResult {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsApi.getProductStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Hook for searching products
 */
export function useProductSearch(debounceMs: number = 300): UseProductSearchResult {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const search = useCallback(async (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await productsApi.searchProducts(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    setTimeoutId(id);
  }, [debounceMs, timeoutId]);

  const clear = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setResults([]);
    setError(null);
  }, [timeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}

/**
 * Hook for managing product variants
 */
export function useProductVariants(productId: string | null): UseProductVariantsResult {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!productId) {
      setVariants([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await productsApi.getProductVariants(productId);
      setVariants(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch variants'));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const addVariant = useCallback(async (variant: Partial<ProductVariant>): Promise<ProductVariant> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const newVariant = await productsApi.createVariant(productId, variant);
      setVariants(prev => [...prev, newVariant]);
      return newVariant;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add variant');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const updateVariant = useCallback(async (
    variantId: string,
    variant: Partial<ProductVariant>
  ): Promise<ProductVariant> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const updatedVariant = await productsApi.updateVariant(productId, variantId, variant);
      setVariants(prev => prev.map(v => v.id === variantId ? updatedVariant : v));
      return updatedVariant;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update variant');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const removeVariant = useCallback(async (variantId: string): Promise<void> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      await productsApi.deleteVariant(productId, variantId);
      setVariants(prev => prev.filter(v => v.id !== variantId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove variant');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return {
    variants,
    loading,
    error,
    refetch: fetchVariants,
    addVariant,
    updateVariant,
    removeVariant,
  };
}

/**
 * Hook for bulk product operations
 */
export function useProductBulkOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkDelete = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await productsApi.bulkDeleteProducts(ids);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Bulk delete failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (
    ids: string[],
    status: 'active' | 'draft' | 'archived'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await productsApi.bulkUpdateProductStatus(ids, status);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Bulk update failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bulkDelete,
    bulkUpdateStatus,
    loading,
    error,
  };
}

/**
 * Hook for product categories and vendors (metadata)
 */
export function useProductMetadata() {
  const [categories, setCategories] = useState<string[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesData, vendorsData] = await Promise.all([
        productsApi.getProductCategories(),
        productsApi.getProductVendors(),
      ]);
      setCategories(categoriesData);
      setVendors(vendorsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metadata'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const categoryOptions = useMemo(() =>
    categories.map(c => ({ label: c, value: c })),
    [categories]
  );

  const vendorOptions = useMemo(() =>
    vendors.map(v => ({ label: v, value: v })),
    [vendors]
  );

  return {
    categories,
    vendors,
    categoryOptions,
    vendorOptions,
    loading,
    error,
    refetch: fetchMetadata,
  };
}

export default {
  useProducts,
  useProduct,
  useProductMutation,
  useProductStats,
  useProductSearch,
  useProductVariants,
  useProductBulkOperations,
  useProductMetadata,
};
