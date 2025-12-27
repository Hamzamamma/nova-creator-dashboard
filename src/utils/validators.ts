/**
 * Validation Utilities for Nova Dashboard
 * Provides comprehensive validation functions for forms and data
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Form validation errors type
 */
export interface ValidationErrors {
  [key: string]: string | undefined;
}

/**
 * Product form data interface
 */
export interface ProductFormData {
  name?: string;
  sku?: string;
  price?: number | string;
  compareAtPrice?: number | string;
  cost?: number | string;
  quantity?: number | string;
  category?: string;
  description?: string;
  barcode?: string;
  weight?: number | string;
}

/**
 * Order form data interface
 */
export interface OrderFormData {
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items?: Array<{ productId: string; quantity: number }>;
  paymentMethod?: string;
}

/**
 * Customer form data interface
 */
export interface CustomerFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

/**
 * Discount form data interface
 */
export interface DiscountFormData {
  code?: string;
  type?: 'percentage' | 'fixed' | 'shipping';
  value?: number | string;
  minPurchase?: number | string;
  maxUses?: number | string;
  startDate?: string | Date;
  endDate?: string | Date;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

/**
 * Validates an email address
 * @param email - Email address to validate
 * @returns Validation result
 * @example isValidEmail('user@example.com') // { isValid: true }
 */
export function isValidEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  // Additional checks
  if (trimmed.length > 254) {
    return { isValid: false, message: 'Email is too long' };
  }

  const [local, domain] = trimmed.split('@');
  if (local.length > 64) {
    return { isValid: false, message: 'Email local part is too long' };
  }

  if (!domain || !domain.includes('.')) {
    return { isValid: false, message: 'Invalid email domain' };
  }

  return { isValid: true };
}

/**
 * Validates a phone number
 * @param phone - Phone number to validate
 * @param countryCode - Country code for validation rules (default: US)
 * @returns Validation result
 */
export function isValidPhone(phone: string, countryCode: string = 'US'): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, '');

  if (countryCode === 'US' || countryCode === 'CA') {
    if (digits.length === 10) {
      return { isValid: true };
    }
    if (digits.length === 11 && digits[0] === '1') {
      return { isValid: true };
    }
    return { isValid: false, message: 'Phone number must be 10 digits' };
  }

  // Generic international validation
  if (digits.length < 7 || digits.length > 15) {
    return { isValid: false, message: 'Invalid phone number length' };
  }

  return { isValid: true };
}

/**
 * Validates a URL
 * @param url - URL to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function isValidUrl(
  url: string,
  options: { requireHttps?: boolean; allowedDomains?: string[] } = {}
): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, message: 'URL is required' };
  }

  try {
    const parsedUrl = new URL(url);

    if (options.requireHttps && parsedUrl.protocol !== 'https:') {
      return { isValid: false, message: 'URL must use HTTPS' };
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, message: 'Invalid URL protocol' };
    }

    if (options.allowedDomains && options.allowedDomains.length > 0) {
      const domain = parsedUrl.hostname.toLowerCase();
      const isAllowed = options.allowedDomains.some(
        (d) => domain === d.toLowerCase() || domain.endsWith(`.${d.toLowerCase()}`)
      );
      if (!isAllowed) {
        return { isValid: false, message: 'Domain not allowed' };
      }
    }

    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Invalid URL format' };
  }
}

/**
 * Validates a product SKU
 * @param sku - SKU to validate
 * @returns Validation result
 */
export function isValidSku(sku: string): ValidationResult {
  if (!sku || typeof sku !== 'string') {
    return { isValid: false, message: 'SKU is required' };
  }

  const trimmed = sku.trim();

  if (trimmed.length < 3) {
    return { isValid: false, message: 'SKU must be at least 3 characters' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, message: 'SKU must not exceed 50 characters' };
  }

  // SKU should be alphanumeric with hyphens and underscores
  const skuRegex = /^[A-Za-z0-9][A-Za-z0-9\-_]*$/;
  if (!skuRegex.test(trimmed)) {
    return { isValid: false, message: 'SKU must contain only letters, numbers, hyphens, and underscores' };
  }

  return { isValid: true };
}

/**
 * Validates a barcode (UPC, EAN, ISBN)
 * @param barcode - Barcode to validate
 * @returns Validation result
 */
export function isValidBarcode(barcode: string): ValidationResult {
  if (!barcode || typeof barcode !== 'string') {
    return { isValid: false, message: 'Barcode is required' };
  }

  const digits = barcode.replace(/\D/g, '');

  // Check common barcode lengths
  const validLengths = [8, 12, 13, 14]; // EAN-8, UPC-A, EAN-13, GTIN-14
  if (!validLengths.includes(digits.length)) {
    return { isValid: false, message: 'Invalid barcode length' };
  }

  // Validate check digit using modulo 10 algorithm
  let sum = 0;
  const isEven = digits.length % 2 === 0;

  for (let i = 0; i < digits.length - 1; i++) {
    const digit = parseInt(digits[i], 10);
    if (isEven) {
      sum += i % 2 === 0 ? digit : digit * 3;
    } else {
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(digits[digits.length - 1], 10);

  if (checkDigit !== lastDigit) {
    return { isValid: false, message: 'Invalid barcode check digit' };
  }

  return { isValid: true };
}

/**
 * Validates a price value
 * @param price - Price to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function isValidPrice(
  price: number | string,
  options: { min?: number; max?: number; allowZero?: boolean } = {}
): ValidationResult {
  const { min = 0, max = 1000000, allowZero = false } = options;

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (numPrice === null || numPrice === undefined || isNaN(numPrice)) {
    return { isValid: false, message: 'Price is required' };
  }

  if (!allowZero && numPrice === 0) {
    return { isValid: false, message: 'Price cannot be zero' };
  }

  if (numPrice < min) {
    return { isValid: false, message: `Price must be at least ${min}` };
  }

  if (numPrice > max) {
    return { isValid: false, message: `Price cannot exceed ${max}` };
  }

  // Check for valid currency format (max 2 decimal places)
  const priceStr = numPrice.toString();
  if (priceStr.includes('.') && priceStr.split('.')[1].length > 2) {
    return { isValid: false, message: 'Price can have at most 2 decimal places' };
  }

  return { isValid: true };
}

/**
 * Validates a quantity value
 * @param qty - Quantity to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function isValidQuantity(
  qty: number | string,
  options: { min?: number; max?: number; allowDecimal?: boolean } = {}
): ValidationResult {
  const { min = 0, max = 1000000, allowDecimal = false } = options;

  const numQty = typeof qty === 'string' ? parseFloat(qty) : qty;

  if (numQty === null || numQty === undefined || isNaN(numQty)) {
    return { isValid: false, message: 'Quantity is required' };
  }

  if (!allowDecimal && !Number.isInteger(numQty)) {
    return { isValid: false, message: 'Quantity must be a whole number' };
  }

  if (numQty < min) {
    return { isValid: false, message: `Quantity must be at least ${min}` };
  }

  if (numQty > max) {
    return { isValid: false, message: `Quantity cannot exceed ${max}` };
  }

  return { isValid: true };
}

/**
 * Validates a password
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function isValidPassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecial?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
  } = options;

  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters` };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true };
}

/**
 * Validates a credit card number using Luhn algorithm
 * @param number - Credit card number to validate
 * @returns Validation result with card type
 */
export function isValidCreditCard(number: string): ValidationResult & { cardType?: string } {
  if (!number || typeof number !== 'string') {
    return { isValid: false, message: 'Credit card number is required' };
  }

  // Remove spaces and dashes
  const digits = number.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(digits)) {
    return { isValid: false, message: 'Credit card number must contain only digits' };
  }

  if (digits.length < 13 || digits.length > 19) {
    return { isValid: false, message: 'Invalid credit card number length' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Invalid credit card number' };
  }

  // Detect card type
  let cardType: string | undefined;
  if (/^4/.test(digits)) {
    cardType = 'Visa';
  } else if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) {
    cardType = 'Mastercard';
  } else if (/^3[47]/.test(digits)) {
    cardType = 'American Express';
  } else if (/^6(?:011|5)/.test(digits)) {
    cardType = 'Discover';
  }

  return { isValid: true, cardType };
}

/**
 * Validates product form data
 * @param data - Product form data to validate
 * @returns Object with validation errors
 */
export function validateProductForm(data: ProductFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Product name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  } else if (data.name.trim().length > 200) {
    errors.name = 'Product name must not exceed 200 characters';
  }

  // SKU validation
  if (data.sku) {
    const skuResult = isValidSku(data.sku);
    if (!skuResult.isValid) {
      errors.sku = skuResult.message;
    }
  }

  // Price validation
  if (data.price !== undefined && data.price !== '') {
    const priceResult = isValidPrice(data.price);
    if (!priceResult.isValid) {
      errors.price = priceResult.message;
    }
  } else {
    errors.price = 'Price is required';
  }

  // Compare at price validation
  if (data.compareAtPrice !== undefined && data.compareAtPrice !== '') {
    const compareResult = isValidPrice(data.compareAtPrice, { allowZero: true });
    if (!compareResult.isValid) {
      errors.compareAtPrice = compareResult.message;
    } else {
      const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
      const compareAt = typeof data.compareAtPrice === 'string'
        ? parseFloat(data.compareAtPrice)
        : data.compareAtPrice;
      if (compareAt && price && compareAt <= price) {
        errors.compareAtPrice = 'Compare at price must be greater than price';
      }
    }
  }

  // Quantity validation
  if (data.quantity !== undefined && data.quantity !== '') {
    const qtyResult = isValidQuantity(data.quantity);
    if (!qtyResult.isValid) {
      errors.quantity = qtyResult.message;
    }
  }

  // Barcode validation
  if (data.barcode) {
    const barcodeResult = isValidBarcode(data.barcode);
    if (!barcodeResult.isValid) {
      errors.barcode = barcodeResult.message;
    }
  }

  return errors;
}

/**
 * Validates order form data
 * @param data - Order form data to validate
 * @returns Object with validation errors
 */
export function validateOrderForm(data: OrderFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Customer email validation
  if (data.customerEmail) {
    const emailResult = isValidEmail(data.customerEmail);
    if (!emailResult.isValid) {
      errors.customerEmail = emailResult.message;
    }
  } else {
    errors.customerEmail = 'Customer email is required';
  }

  // Customer phone validation (optional but validate if provided)
  if (data.customerPhone) {
    const phoneResult = isValidPhone(data.customerPhone);
    if (!phoneResult.isValid) {
      errors.customerPhone = phoneResult.message;
    }
  }

  // Shipping address validation
  if (data.shippingAddress) {
    if (!data.shippingAddress.street?.trim()) {
      errors['shippingAddress.street'] = 'Street address is required';
    }
    if (!data.shippingAddress.city?.trim()) {
      errors['shippingAddress.city'] = 'City is required';
    }
    if (!data.shippingAddress.zipCode?.trim()) {
      errors['shippingAddress.zipCode'] = 'ZIP code is required';
    }
    if (!data.shippingAddress.country?.trim()) {
      errors['shippingAddress.country'] = 'Country is required';
    }
  } else {
    errors.shippingAddress = 'Shipping address is required';
  }

  // Items validation
  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors[`items.${index}.productId`] = 'Product is required';
      }
      if (!item.quantity || item.quantity < 1) {
        errors[`items.${index}.quantity`] = 'Quantity must be at least 1';
      }
    });
  }

  return errors;
}

/**
 * Validates customer form data
 * @param data - Customer form data to validate
 * @returns Object with validation errors
 */
export function validateCustomerForm(data: CustomerFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // First name validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last name validation
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  if (data.email) {
    const emailResult = isValidEmail(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.message;
    }
  } else {
    errors.email = 'Email is required';
  }

  // Phone validation (optional but validate if provided)
  if (data.phone) {
    const phoneResult = isValidPhone(data.phone);
    if (!phoneResult.isValid) {
      errors.phone = phoneResult.message;
    }
  }

  return errors;
}

/**
 * Validates discount form data
 * @param data - Discount form data to validate
 * @returns Object with validation errors
 */
export function validateDiscountForm(data: DiscountFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Code validation
  if (!data.code?.trim()) {
    errors.code = 'Discount code is required';
  } else if (data.code.trim().length < 3) {
    errors.code = 'Discount code must be at least 3 characters';
  } else if (!/^[A-Za-z0-9_-]+$/.test(data.code.trim())) {
    errors.code = 'Discount code can only contain letters, numbers, hyphens, and underscores';
  }

  // Type validation
  if (!data.type) {
    errors.type = 'Discount type is required';
  } else if (!['percentage', 'fixed', 'shipping'].includes(data.type)) {
    errors.type = 'Invalid discount type';
  }

  // Value validation
  if (data.value === undefined || data.value === '') {
    errors.value = 'Discount value is required';
  } else {
    const numValue = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
    if (isNaN(numValue) || numValue < 0) {
      errors.value = 'Discount value must be a positive number';
    } else if (data.type === 'percentage' && numValue > 100) {
      errors.value = 'Percentage discount cannot exceed 100%';
    }
  }

  // Date validation
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return errors;
}
