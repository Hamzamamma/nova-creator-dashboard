/**
 * API Services Index
 * Central export point for all Nova Dashboard API services
 */

// =============================================================================
// PRODUCTS API
// =============================================================================
export {
  productsApi,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProductStatus,
  getProductVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
  getProductStats,
  searchProducts,
  getProductCategories,
  getProductVendors,
  duplicateProduct,
  exportProducts,
  importProducts,
} from './products';

export type {
  Product,
  ProductVariant,
  ProductVariantOption,
  ProductImage,
  ProductSEO,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductSortOptions,
  ProductStats,
  BulkActionResult as ProductBulkActionResult,
  ImageUploadResult,
} from './products';

// =============================================================================
// ORDERS API
// =============================================================================
export {
  ordersApi,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  fulfillOrder,
  updateFulfillmentTracking,
  cancelFulfillment,
  cancelOrder,
  refundOrder,
  getOrderTimeline,
  addOrderNote,
  deleteOrderNote,
  getOrderStats,
  searchOrders,
  exportOrders,
  resendOrderConfirmation,
  getPackingSlip,
  getInvoice,
  markOrderAsPaid,
  archiveOrder,
  unarchiveOrder,
} from './orders';

export type {
  Order,
  OrderAddress,
  OrderCustomer,
  OrderLineItem,
  OrderDiscount,
  OrderShipping,
  OrderPayment,
  OrderRefund,
  OrderFulfillment,
  OrderTimelineEvent,
  OrderNote,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  CreateOrderInput,
  UpdateOrderInput,
  OrderFilters,
  OrderSortOptions,
  OrderStats,
  FulfillOrderInput,
  RefundOrderInput,
} from './orders';

// =============================================================================
// CUSTOMERS API
// =============================================================================
export {
  customersApi,
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  getCustomerStats,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
  getCustomerOverviewStats,
  searchCustomers,
  getCustomerSegments,
  exportCustomers,
  importCustomers,
  sendCustomerInvite,
  bulkUpdateCustomerTags,
  mergeCustomers,
} from './customers';

export type {
  Customer,
  CustomerAddress,
  CustomerMetadata,
  CustomerStats,
  CustomerSegment,
  CustomerState,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerFilters,
  CustomerSortOptions,
  CustomerOverviewStats,
  CustomerOrder,
} from './customers';

// =============================================================================
// COLLECTIONS API
// =============================================================================
export {
  collectionsApi,
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionProducts,
  addProductsToCollection,
  removeProductsFromCollection,
  reorderCollectionProducts,
  searchCollections,
  publishCollection,
  unpublishCollection,
  duplicateCollection,
  previewSmartCollection,
} from './collections';

export type {
  Collection,
  CollectionCondition,
  CollectionRule,
  CollectionSEO,
  CollectionImage,
  CollectionSortOrder,
  CreateCollectionInput,
  UpdateCollectionInput,
  CollectionFilters,
  CollectionSortOptions,
  CollectionProduct,
} from './collections';

// =============================================================================
// INVENTORY API
// =============================================================================
export {
  inventoryApi,
  getInventory,
  getInventoryItem,
  adjustInventory,
  setInventory,
  bulkAdjustInventory,
  getInventoryHistory,
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  getTransfers,
  createTransfer,
  completeTransfer,
  cancelTransfer,
  getInventoryStats,
  exportInventory,
  importInventory,
} from './inventory';

export type {
  InventoryItem,
  InventoryLevel,
  InventoryLocation,
  InventoryAdjustment,
  InventoryAdjustmentReason,
  InventoryTransfer,
  InventoryFilters,
  InventorySortOptions,
  InventoryStats,
  AdjustInventoryInput,
  SetInventoryInput,
  CreateTransferInput,
} from './inventory';

// =============================================================================
// ANALYTICS API
// =============================================================================
export {
  analyticsApi,
  getDashboardAnalytics,
  getRevenueMetrics,
  getOrderMetrics,
  getCustomerMetrics,
  getConversionMetrics,
  getTrafficMetrics,
  getRevenueChart,
  getOrdersChart,
  getTopProducts,
  getTopCustomers,
  getProductPerformance,
  getSalesByLocation,
  getSalesByCategory,
  getTrafficSources,
  getDiscountAnalysis,
  getRefundAnalysis,
  generateReport,
  getReportHistory,
  scheduleReport,
  getScheduledReports,
  deleteScheduledReport,
} from './analytics';

export type {
  DateRange,
  MetricData,
  RevenueMetrics,
  OrderMetrics,
  CustomerMetrics,
  ConversionMetrics,
  TrafficMetrics,
  ChartDataPoint,
  TimeSeriesData,
  TopProduct,
  TopCustomer,
  TrafficSource,
  SalesByLocation,
  SalesByCategory,
  SalesByChannel,
  HourlyDistribution,
  DayOfWeekDistribution,
  DiscountAnalysis,
  RefundAnalysis,
  CustomerSegmentAnalysis,
  ProductPerformance,
  AnalyticsDashboardData,
  ReportConfig,
  GeneratedReport,
} from './analytics';

// =============================================================================
// DISCOUNTS API
// =============================================================================
export {
  discountsApi,
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  activateDiscount,
  deactivateDiscount,
  validateDiscountCode,
  checkDiscountCodeAvailability,
  generateDiscountCode,
  getDiscountUsage,
  getDiscountPerformance,
  getDiscountStats,
  bulkCreateDiscounts,
  bulkDeleteDiscounts,
  bulkUpdateDiscountStatus,
  duplicateDiscount,
} from './discounts';

export type {
  Discount,
  DiscountType,
  DiscountStatus,
  DiscountTarget,
  DiscountAllocation,
  DiscountCondition,
  BuyXGetYConfig,
  DiscountUsageLimits,
  DiscountDateRange,
  CreateDiscountInput,
  UpdateDiscountInput,
  DiscountFilters,
  DiscountSortOptions,
  DiscountStats,
  DiscountUsage,
  DiscountPerformance,
  ValidateDiscountResult,
} from './discounts';

// =============================================================================
// SHARED TYPES
// =============================================================================
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

// =============================================================================
// API CLIENT CONFIGURATION
// =============================================================================
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retryAttempts: 3,
};

// =============================================================================
// UNIFIED API OBJECT
// =============================================================================
import { productsApi } from './products';
import { ordersApi } from './orders';
import { customersApi } from './customers';
import { collectionsApi } from './collections';
import { inventoryApi } from './inventory';
import { analyticsApi } from './analytics';
import { discountsApi } from './discounts';

export const api = {
  products: productsApi,
  orders: ordersApi,
  customers: customersApi,
  collections: collectionsApi,
  inventory: inventoryApi,
  analytics: analyticsApi,
  discounts: discountsApi,
};

export default api;
