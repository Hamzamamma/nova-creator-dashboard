/**
 * Application Constants for Nova Dashboard
 * Centralized constants for consistent usage across the application
 */

/**
 * Order status types and configuration
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  ON_HOLD: 'on_hold',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUSES.PENDING]: 'Pending',
  [ORDER_STATUSES.CONFIRMED]: 'Confirmed',
  [ORDER_STATUSES.PROCESSING]: 'Processing',
  [ORDER_STATUSES.SHIPPED]: 'Shipped',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
  [ORDER_STATUSES.CANCELLED]: 'Cancelled',
  [ORDER_STATUSES.REFUNDED]: 'Refunded',
  [ORDER_STATUSES.ON_HOLD]: 'On Hold',
};

/**
 * Payment status types and configuration
 */
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  VOIDED: 'voided',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUSES.PENDING]: 'Pending',
  [PAYMENT_STATUSES.AUTHORIZED]: 'Authorized',
  [PAYMENT_STATUSES.PAID]: 'Paid',
  [PAYMENT_STATUSES.PARTIALLY_PAID]: 'Partially Paid',
  [PAYMENT_STATUSES.FAILED]: 'Failed',
  [PAYMENT_STATUSES.REFUNDED]: 'Refunded',
  [PAYMENT_STATUSES.PARTIALLY_REFUNDED]: 'Partially Refunded',
  [PAYMENT_STATUSES.VOIDED]: 'Voided',
};

/**
 * Fulfillment status types and configuration
 */
export const FULFILLMENT_STATUSES = {
  UNFULFILLED: 'unfulfilled',
  PARTIALLY_FULFILLED: 'partially_fulfilled',
  FULFILLED: 'fulfilled',
  PENDING_PICKUP: 'pending_pickup',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
} as const;

export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[keyof typeof FULFILLMENT_STATUSES];

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  [FULFILLMENT_STATUSES.UNFULFILLED]: 'Unfulfilled',
  [FULFILLMENT_STATUSES.PARTIALLY_FULFILLED]: 'Partially Fulfilled',
  [FULFILLMENT_STATUSES.FULFILLED]: 'Fulfilled',
  [FULFILLMENT_STATUSES.PENDING_PICKUP]: 'Pending Pickup',
  [FULFILLMENT_STATUSES.PICKED_UP]: 'Picked Up',
  [FULFILLMENT_STATUSES.IN_TRANSIT]: 'In Transit',
  [FULFILLMENT_STATUSES.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [FULFILLMENT_STATUSES.DELIVERED]: 'Delivered',
  [FULFILLMENT_STATUSES.RETURNED]: 'Returned',
};

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Apparel' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'food', label: 'Food & Beverages' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'books', label: 'Books & Media' },
  { value: 'jewelry', label: 'Jewelry & Accessories' },
  { value: 'pet', label: 'Pet Supplies' },
  { value: 'office', label: 'Office Supplies' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Product types
 */
export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  SERVICE: 'service',
  SUBSCRIPTION: 'subscription',
  BUNDLE: 'bundle',
  GIFT_CARD: 'gift_card',
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

/**
 * Discount types
 */
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping',
  BUY_X_GET_Y: 'buy_x_get_y',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

/**
 * Currency codes (ISO 4217)
 */
export const CURRENCY_CODES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '\u20B9', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
] as const;

/**
 * Country codes (ISO 3166-1)
 */
export const COUNTRY_CODES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
] as const;

/**
 * Date format presets
 */
export const DATE_FORMATS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  FULL: 'full',
  ISO: 'iso',
  NUMERIC: 'numeric',
} as const;

/**
 * Pagination limits
 */
export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  SMALL: 5,
  MEDIUM: 25,
  LARGE: 50,
  MAX: 100,
} as const;

export const PAGINATION_OPTIONS = [5, 10, 25, 50, 100] as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCT_VARIANTS: (id: string) => `/api/products/${id}/variants`,
  PRODUCT_IMAGES: (id: string) => `/api/products/${id}/images`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  ORDER_ITEMS: (id: string) => `/api/orders/${id}/items`,
  ORDER_FULFILLMENT: (id: string) => `/api/orders/${id}/fulfillment`,

  // Customers
  CUSTOMERS: '/api/customers',
  CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}`,
  CUSTOMER_ORDERS: (id: string) => `/api/customers/${id}/orders`,

  // Inventory
  INVENTORY: '/api/inventory',
  INVENTORY_BY_ID: (id: string) => `/api/inventory/${id}`,
  INVENTORY_ADJUST: (id: string) => `/api/inventory/${id}/adjust`,

  // Analytics
  ANALYTICS_OVERVIEW: '/api/analytics/overview',
  ANALYTICS_SALES: '/api/analytics/sales',
  ANALYTICS_PRODUCTS: '/api/analytics/products',
  ANALYTICS_CUSTOMERS: '/api/analytics/customers',

  // Settings
  SETTINGS: '/api/settings',
  SETTINGS_STORE: '/api/settings/store',
  SETTINGS_PAYMENTS: '/api/settings/payments',
  SETTINGS_SHIPPING: '/api/settings/shipping',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // General
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',

  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password.',
  AUTH_EMAIL_EXISTS: 'An account with this email already exists.',
  AUTH_SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_PASSWORD_MISMATCH: 'Passwords do not match.',

  // Products
  PRODUCT_NOT_FOUND: 'Product not found.',
  PRODUCT_OUT_OF_STOCK: 'This product is currently out of stock.',
  PRODUCT_SKU_EXISTS: 'A product with this SKU already exists.',

  // Orders
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_CANNOT_CANCEL: 'This order cannot be cancelled.',
  ORDER_CANNOT_REFUND: 'This order cannot be refunded.',

  // Inventory
  INVENTORY_INSUFFICIENT: 'Insufficient inventory.',
  INVENTORY_NEGATIVE: 'Inventory cannot be negative.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  // General
  SAVED: 'Changes saved successfully.',
  DELETED: 'Successfully deleted.',
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',

  // Authentication
  AUTH_LOGIN: 'Welcome back!',
  AUTH_LOGOUT: 'You have been logged out.',
  AUTH_REGISTER: 'Account created successfully.',
  AUTH_PASSWORD_RESET: 'Password reset email sent.',
  AUTH_PASSWORD_CHANGED: 'Password changed successfully.',

  // Products
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',

  // Orders
  ORDER_CREATED: 'Order created successfully.',
  ORDER_UPDATED: 'Order updated successfully.',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  ORDER_REFUNDED: 'Order refunded successfully.',
  ORDER_FULFILLED: 'Order fulfilled successfully.',

  // Customers
  CUSTOMER_CREATED: 'Customer created successfully.',
  CUSTOMER_UPDATED: 'Customer updated successfully.',
  CUSTOMER_DELETED: 'Customer deleted successfully.',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'nova_auth_token',
  REFRESH_TOKEN: 'nova_refresh_token',
  USER: 'nova_user',
  THEME: 'nova_theme',
  LOCALE: 'nova_locale',
  SIDEBAR_COLLAPSED: 'nova_sidebar_collapsed',
  TABLE_PREFERENCES: 'nova_table_preferences',
  RECENT_SEARCHES: 'nova_recent_searches',
} as const;
