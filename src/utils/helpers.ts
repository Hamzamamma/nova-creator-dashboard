/**
 * General Helper Utilities for Nova Dashboard
 * Provides commonly used utility functions for data manipulation
 */

/**
 * Generates a unique ID (UUID v4)
 * @returns Unique identifier string
 * @example generateId() // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId(): string {
  // Use crypto API if available, otherwise fallback to Math.random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a SKU with optional prefix
 * @param prefix - SKU prefix (default: 'SKU')
 * @returns Generated SKU string
 * @example generateSku('PROD') // "PROD-A1B2C3"
 */
export function generateSku(prefix: string = 'SKU'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';

  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}-${suffix}`;
}

/**
 * Generates an order number
 * @returns Generated order number
 * @example generateOrderNumber() // "ORD-20240115-ABC123"
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';

  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `ORD-${dateStr}-${suffix}`;
}

/**
 * Converts a string to URL-friendly slug
 * @param text - Text to slugify
 * @returns Slugified string
 * @example slugify('Hello World!') // "hello-world"
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

/**
 * Capitalizes the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized string
 * @example capitalize('hello world') // "Hello world"
 */
export function capitalize(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes the first letter of each word
 * @param text - Text to title case
 * @returns Title cased string
 * @example titleCase('hello world') // "Hello World"
 */
export function titleCase(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Creates a debounced version of a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @example const debouncedSearch = debounce(search, 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Creates a throttled version of a function
 * @param fn - Function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled function
 * @example const throttledScroll = throttle(handleScroll, 100)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, delay - (now - lastCall));
    }
  };
}

/**
 * Creates a deep clone of an object
 * @param obj - Object to clone
 * @returns Deep cloned object
 * @example deepClone({ a: { b: 1 } }) // { a: { b: 1 } }
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((value, key) => {
      map.set(deepClone(key), deepClone(value));
    });
    return map as unknown as T;
  }

  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach((value) => {
      set.add(deepClone(value));
    });
    return set as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (cloned as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key]
      );
    }
  }

  return cloned;
}

/**
 * Deep merges two objects
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 * @example mergeDeep({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];

      if (isObject(sourceValue) && isObject(targetValue)) {
        (output as Record<string, unknown>)[key] = mergeDeep(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        (output as Record<string, unknown>)[key] = sourceValue;
      }
    });
  }

  return output;
}

/**
 * Helper function to check if value is an object
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Picks specified keys from an object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only specified keys
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Omits specified keys from an object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without specified keys
 * @example omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result as Omit<T, K>;
}

/**
 * Groups an array of objects by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped arrays
 * @example groupBy([{ type: 'a', value: 1 }, { type: 'b', value: 2 }], 'type')
 */
export function groupBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  if (!array || !Array.isArray(array)) {
    return {};
  }

  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array of objects by a key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 * @example sortBy([{ name: 'b' }, { name: 'a' }], 'name') // [{ name: 'a' }, { name: 'b' }]
 */
export function sortBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    let comparison: number;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = aValue < bValue ? -1 : 1;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

/**
 * Returns unique items from an array based on a key
 * @param array - Array to deduplicate
 * @param key - Key to check for uniqueness
 * @returns Array with unique items
 * @example uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], 'id') // [{ id: 1 }, { id: 2 }]
 */
export function uniqueBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  const seen = new Set();

  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Splits an array into chunks of specified size
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (!array || !Array.isArray(array) || size < 1) {
    return [];
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 * @example isEmpty(null) // true
 * @example isEmpty([]) // true
 * @example isEmpty({}) // true
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Deep equality check for two values
 * @param a - First value
 * @param b - Second value
 * @returns True if values are deeply equal
 * @example isEqual({ a: 1 }, { a: 1 }) // true
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
}

/**
 * Flattens a nested array
 * @param array - Array to flatten
 * @param depth - Maximum depth to flatten (default: Infinity)
 * @returns Flattened array
 * @example flatten([[1, 2], [3, [4, 5]]]) // [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: unknown[], depth: number = Infinity): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  return array.flat(depth) as T[];
}

/**
 * Creates a range of numbers
 * @param start - Start of range (inclusive)
 * @param end - End of range (exclusive)
 * @param step - Step size (default: 1)
 * @returns Array of numbers
 * @example range(1, 5) // [1, 2, 3, 4]
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];

  if (step === 0) {
    return result;
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}

/**
 * Shuffles an array randomly (Fisher-Yates algorithm)
 * @param array - Array to shuffle
 * @returns Shuffled array (new array)
 * @example shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]
 */
export function shuffle<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
