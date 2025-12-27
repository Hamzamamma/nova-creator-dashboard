/**
 * Nova Dashboard Utilities
 * Central export file for all utility functions and constants
 */

// Formatters
export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatDuration,
  formatPhoneNumber,
  truncateText,
  pluralize,
} from './formatters';

// Validators
export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidSku,
  isValidBarcode,
  isValidPrice,
  isValidQuantity,
  isValidPassword,
  isValidCreditCard,
  validateProductForm,
  validateOrderForm,
  validateCustomerForm,
  validateDiscountForm,
} from './validators';

export type {
  ValidationResult,
  ValidationErrors,
  ProductFormData,
  OrderFormData,
  CustomerFormData,
  DiscountFormData,
} from './validators';

// Calculations
export {
  calculateSubtotal,
  calculateTax,
  calculateDiscount,
  calculateTotal,
  calculateMargin,
  calculateMarkup,
  calculateAverageOrderValue,
  calculateConversionRate,
  calculateGrowthRate,
  calculateInventoryValue,
  calculatePriceFromMargin,
  calculatePriceFromMarkup,
  calculateBreakEvenQuantity,
  calculateROI,
  calculateCLV,
  calculateWeightedAverage,
} from './calculations';

export type { CartItem, InventoryItem, Order, DiscountConfig } from './calculations';

// Helpers
export {
  generateId,
  generateSku,
  generateOrderNumber,
  slugify,
  capitalize,
  titleCase,
  debounce,
  throttle,
  deepClone,
  mergeDeep,
  pick,
  omit,
  groupBy,
  sortBy,
  uniqueBy,
  chunk,
  isEmpty,
  isEqual,
  flatten,
  range,
  shuffle,
} from './helpers';

// Constants
export {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  FULFILLMENT_STATUSES,
  FULFILLMENT_STATUS_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
  DISCOUNT_TYPES,
  CURRENCY_CODES,
  COUNTRY_CODES,
  DATE_FORMATS,
  PAGINATION_LIMITS,
  PAGINATION_OPTIONS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
} from './constants';

export type {
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  ProductType,
  DiscountType,
} from './constants';

// Colors
export {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  FULFILLMENT_STATUS_COLORS,
  getStatusColor,
  hexToRgb,
  rgbToHex,
  lighten,
  darken,
  rgba,
  isLightColor,
  getContrastColor,
  generatePalette,
} from './colors';

export type { RGBColor, StatusColorConfig } from './colors';

// Dates
export {
  getToday,
  getYesterday,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfQuarter,
  getEndOfQuarter,
  getStartOfYear,
  getEndOfYear,
  getDateRange,
  isToday,
  isYesterday,
  isSameDay,
  isSameMonth,
  addDays,
  subtractDays,
  addMonths,
  getDaysBetween,
  formatDateRange,
  getWeekNumber,
  getQuarter,
  getFiscalQuarter,
  isDateInRange,
  getDatesBetween,
  isWeekend,
  startOfDay,
  endOfDay,
} from './dates';

export type { DateRangePreset, DateRange } from './dates';

// Storage
export {
  getItem,
  setItem,
  removeItem,
  clear,
  getSessionItem,
  setSessionItem,
  removeSessionItem,
  clearSession,
  getKeys,
  getStorageSize,
  hasItem,
  getItems,
  setItems,
} from './storage';

export type { StorageType, StorageOptions } from './storage';
