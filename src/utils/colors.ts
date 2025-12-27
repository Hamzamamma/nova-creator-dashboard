/**
 * Color Utilities for Nova Dashboard
 * Provides color manipulation and status color mapping functions
 */

import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  FULFILLMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type FulfillmentStatus,
} from './constants';

/**
 * RGB color type
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Status color configuration with background and text colors
 */
export interface StatusColorConfig {
  bg: string;
  text: string;
  border?: string;
}

/**
 * Status colors mapping for order statuses
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, StatusColorConfig> = {
  [ORDER_STATUSES.PENDING]: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  [ORDER_STATUSES.CONFIRMED]: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  [ORDER_STATUSES.PROCESSING]: { bg: '#E0E7FF', text: '#3730A3', border: '#6366F1' },
  [ORDER_STATUSES.SHIPPED]: { bg: '#CFFAFE', text: '#0E7490', border: '#06B6D4' },
  [ORDER_STATUSES.DELIVERED]: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  [ORDER_STATUSES.CANCELLED]: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  [ORDER_STATUSES.REFUNDED]: { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' },
  [ORDER_STATUSES.ON_HOLD]: { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
};

/**
 * Status colors mapping for payment statuses
 */
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, StatusColorConfig> = {
  [PAYMENT_STATUSES.PENDING]: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  [PAYMENT_STATUSES.AUTHORIZED]: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  [PAYMENT_STATUSES.PAID]: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  [PAYMENT_STATUSES.PARTIALLY_PAID]: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  [PAYMENT_STATUSES.FAILED]: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  [PAYMENT_STATUSES.REFUNDED]: { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' },
  [PAYMENT_STATUSES.PARTIALLY_REFUNDED]: { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' },
  [PAYMENT_STATUSES.VOIDED]: { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
};

/**
 * Status colors mapping for fulfillment statuses
 */
export const FULFILLMENT_STATUS_COLORS: Record<FulfillmentStatus, StatusColorConfig> = {
  [FULFILLMENT_STATUSES.UNFULFILLED]: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  [FULFILLMENT_STATUSES.PARTIALLY_FULFILLED]: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  [FULFILLMENT_STATUSES.FULFILLED]: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  [FULFILLMENT_STATUSES.PENDING_PICKUP]: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  [FULFILLMENT_STATUSES.PICKED_UP]: { bg: '#E0E7FF', text: '#3730A3', border: '#6366F1' },
  [FULFILLMENT_STATUSES.IN_TRANSIT]: { bg: '#CFFAFE', text: '#0E7490', border: '#06B6D4' },
  [FULFILLMENT_STATUSES.OUT_FOR_DELIVERY]: { bg: '#ECFDF5', text: '#047857', border: '#34D399' },
  [FULFILLMENT_STATUSES.DELIVERED]: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  [FULFILLMENT_STATUSES.RETURNED]: { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' },
};

/**
 * Generic status type
 */
type StatusType = 'order' | 'payment' | 'fulfillment' | 'generic';

/**
 * Gets the color configuration for a status
 * @param status - Status value
 * @param type - Type of status (order, payment, fulfillment, generic)
 * @returns Status color configuration
 * @example getStatusColor('pending', 'order') // { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' }
 */
export function getStatusColor(
  status: string,
  type: StatusType = 'generic'
): StatusColorConfig {
  const defaultColors: StatusColorConfig = {
    bg: '#F3F4F6',
    text: '#374151',
    border: '#9CA3AF',
  };

  if (!status) {
    return defaultColors;
  }

  const normalizedStatus = status.toLowerCase();

  switch (type) {
    case 'order':
      return ORDER_STATUS_COLORS[normalizedStatus as OrderStatus] || defaultColors;

    case 'payment':
      return PAYMENT_STATUS_COLORS[normalizedStatus as PaymentStatus] || defaultColors;

    case 'fulfillment':
      return FULFILLMENT_STATUS_COLORS[normalizedStatus as FulfillmentStatus] || defaultColors;

    case 'generic':
    default:
      // Generic color mapping based on common status patterns
      if (['success', 'completed', 'delivered', 'paid', 'active'].includes(normalizedStatus)) {
        return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
      }
      if (['pending', 'processing', 'in_progress'].includes(normalizedStatus)) {
        return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      }
      if (['error', 'failed', 'cancelled', 'rejected'].includes(normalizedStatus)) {
        return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
      }
      if (['info', 'new', 'draft'].includes(normalizedStatus)) {
        return { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
      }
      return defaultColors;
  }
}

/**
 * Converts a hex color to RGB values
 * @param hex - Hex color string (with or without #)
 * @returns RGB color object or null if invalid
 * @example hexToRgb('#FF5733') // { r: 255, g: 87, b: 51 }
 */
export function hexToRgb(hex: string): RGBColor | null {
  if (!hex || typeof hex !== 'string') {
    return null;
  }

  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Handle shorthand hex (#FFF)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  if (fullHex.length !== 6) {
    return null;
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);

  if (!result) {
    return null;
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Converts RGB values to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 * @example rgbToHex(255, 87, 51) // "#FF5733"
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

  const toHex = (value: number) => {
    const hex = clamp(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Lightens a hex color by a percentage
 * @param hex - Hex color string
 * @param amount - Amount to lighten (0-1)
 * @returns Lightened hex color
 * @example lighten('#3B82F6', 0.2) // "#629AF8"
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return hex;
  }

  const clampedAmount = Math.max(0, Math.min(1, amount));

  const newR = rgb.r + (255 - rgb.r) * clampedAmount;
  const newG = rgb.g + (255 - rgb.g) * clampedAmount;
  const newB = rgb.b + (255 - rgb.b) * clampedAmount;

  return rgbToHex(newR, newG, newB);
}

/**
 * Darkens a hex color by a percentage
 * @param hex - Hex color string
 * @param amount - Amount to darken (0-1)
 * @returns Darkened hex color
 * @example darken('#3B82F6', 0.2) // "#2F68C5"
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return hex;
  }

  const clampedAmount = Math.max(0, Math.min(1, amount));

  const newR = rgb.r * (1 - clampedAmount);
  const newG = rgb.g * (1 - clampedAmount);
  const newB = rgb.b * (1 - clampedAmount);

  return rgbToHex(newR, newG, newB);
}

/**
 * Adjusts color opacity for use with rgba
 * @param hex - Hex color string
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 * @example rgba('#3B82F6', 0.5) // "rgba(59, 130, 246, 0.5)"
 */
export function rgba(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Determines if a color is light or dark
 * @param hex - Hex color string
 * @returns True if the color is light
 * @example isLightColor('#FFFFFF') // true
 * @example isLightColor('#000000') // false
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return false;
  }

  // Using relative luminance formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5;
}

/**
 * Gets a contrasting text color (black or white) for a background color
 * @param backgroundColor - Background hex color
 * @returns Contrasting text color
 * @example getContrastColor('#3B82F6') // "#FFFFFF"
 */
export function getContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * Generates a color palette from a base color
 * @param baseColor - Base hex color
 * @returns Object with color variations
 * @example generatePalette('#3B82F6')
 */
export function generatePalette(baseColor: string): Record<string, string> {
  return {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.8),
    200: lighten(baseColor, 0.6),
    300: lighten(baseColor, 0.4),
    400: lighten(baseColor, 0.2),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.25),
    800: darken(baseColor, 0.4),
    900: darken(baseColor, 0.55),
  };
}
