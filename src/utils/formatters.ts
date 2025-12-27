/**
 * Formatting Utilities for Nova Dashboard
 * Provides comprehensive formatting functions for currency, numbers, dates, and text
 */

/**
 * Currency configuration type
 */
interface CurrencyConfig {
  locale: string;
  currency: string;
}

/**
 * Formats a number as currency with proper locale and currency symbol
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: USD)
 * @param locale - BCP 47 locale string (default: en-US)
 * @returns Formatted currency string
 * @example formatCurrency(1234.56) // "$1,234.56"
 * @example formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency or locale
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Formats a number with specified decimal places and locale-aware separators
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - BCP 47 locale string (default: en-US)
 * @returns Formatted number string
 * @example formatNumber(1234567.89, 2) // "1,234,567.89"
 */
export function formatNumber(
  num: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats a decimal number as a percentage
 * @param value - The decimal value to format (0.15 = 15%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 * @example formatPercentage(0.156) // "15.6%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Date format options for formatDate function
 */
type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'iso' | 'numeric';

/**
 * Formats a date according to specified format
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param format - Format type (default: 'medium')
 * @param locale - BCP 47 locale string (default: en-US)
 * @returns Formatted date string
 * @example formatDate(new Date(), 'short') // "1/15/24"
 * @example formatDate(new Date(), 'long') // "January 15, 2024"
 */
export function formatDate(
  date: Date | string | number,
  format: DateFormat = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    iso: { year: 'numeric', month: '2-digit', day: '2-digit' },
    numeric: { month: '2-digit', day: '2-digit', year: 'numeric' },
  };

  if (format === 'iso') {
    return dateObj.toISOString().split('T')[0];
  }

  return new Intl.DateTimeFormat(locale, formatOptions[format]).format(dateObj);
}

/**
 * Formats a date with time
 * @param date - Date to format
 * @param locale - BCP 47 locale string (default: en-US)
 * @returns Formatted date and time string
 * @example formatDateTime(new Date()) // "Jan 15, 2024, 3:30 PM"
 */
export function formatDateTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @param locale - BCP 47 locale string (default: en-US)
 * @returns Relative time string
 * @example formatRelativeTime(hourAgo) // "1 hour ago"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(-diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 7) {
    return rtf.format(-diffInDays, 'day');
  } else if (Math.abs(diffInWeeks) < 4) {
    return rtf.format(-diffInWeeks, 'week');
  } else if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-diffInMonths, 'month');
  } else {
    return rtf.format(-diffInYears, 'year');
  }
}

/**
 * Formats bytes into human-readable file size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 * @example formatFileSize(1536) // "1.50 KB"
 * @example formatFileSize(1048576) // "1.00 MB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes === null || bytes === undefined || isNaN(bytes)) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(decimals)} ${sizes[Math.min(i, sizes.length - 1)]}`;
}

/**
 * Formats seconds into human-readable duration
 * @param seconds - Total seconds
 * @param options - Formatting options
 * @returns Formatted duration string
 * @example formatDuration(3665) // "1h 1m 5s"
 * @example formatDuration(90, { long: true }) // "1 minute, 30 seconds"
 */
export function formatDuration(
  seconds: number,
  options: { long?: boolean } = {}
): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return options.long ? '0 seconds' : '0s';
  }

  const absSeconds = Math.abs(Math.floor(seconds));
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  if (options.long) {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
    return parts.join(', ');
  }

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Formats a phone number into standard format
 * @param phone - Phone number string (digits only or with formatting)
 * @param countryCode - Country code (default: US)
 * @returns Formatted phone number
 * @example formatPhoneNumber('1234567890') // "(123) 456-7890"
 */
export function formatPhoneNumber(
  phone: string,
  countryCode: string = 'US'
): string {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (countryCode === 'US' || countryCode === 'CA') {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }

  // Generic international format
  if (digits.length > 10) {
    return `+${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -7)} ${digits.slice(-7, -4)} ${digits.slice(-4)}`;
  }

  return phone;
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated text
 * @example truncateText('Hello World', 8) // "Hello..."
 */
export function truncateText(
  text: string,
  maxLength: number = 100,
  suffix: string = '...'
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const truncatedLength = maxLength - suffix.length;
  return text.slice(0, truncatedLength).trim() + suffix;
}

/**
 * Returns singular or plural form based on count
 * @param count - The count to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Formatted string with count and appropriate word form
 * @example pluralize(1, 'item') // "1 item"
 * @example pluralize(5, 'item') // "5 items"
 * @example pluralize(3, 'person', 'people') // "3 people"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${formatNumber(count)} ${word}`;
}
