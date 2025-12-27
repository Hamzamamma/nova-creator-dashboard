/**
 * Storage Utilities for Nova Dashboard
 * Provides type-safe wrappers for localStorage and sessionStorage
 */

/**
 * Storage type enum
 */
export type StorageType = 'local' | 'session';

/**
 * Storage options
 */
export interface StorageOptions {
  /** Time to live in milliseconds */
  ttl?: number;
  /** Storage type (default: 'local') */
  storageType?: StorageType;
}

/**
 * Stored item wrapper with metadata
 */
interface StoredItem<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

/**
 * Checks if storage is available
 * @param type - Storage type to check
 * @returns True if storage is available
 */
function isStorageAvailable(type: StorageType): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the storage object based on type
 * @param type - Storage type
 * @returns Storage object or null
 */
function getStorage(type: StorageType): Storage | null {
  if (!isStorageAvailable(type)) {
    return null;
  }

  return type === 'local' ? window.localStorage : window.sessionStorage;
}

/**
 * Gets an item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Stored value or default
 * @example getItem('user', null)
 */
export function getItem<T>(key: string, defaultValue: T | null = null): T | null {
  const storage = getStorage('local');

  if (!storage) {
    return defaultValue;
  }

  try {
    const item = storage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    const parsed: StoredItem<T> = JSON.parse(item);

    // Check if item has expired
    if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
      storage.removeItem(key);
      return defaultValue;
    }

    return parsed.value;
  } catch {
    // If parsing fails, try to return raw value
    try {
      const rawItem = storage.getItem(key);
      return rawItem !== null ? (JSON.parse(rawItem) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

/**
 * Sets an item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 * @returns True if successful
 * @example setItem('user', { name: 'John' })
 * @example setItem('token', 'abc123', { ttl: 3600000 })
 */
export function setItem<T>(key: string, value: T, options: StorageOptions = {}): boolean {
  const { ttl, storageType = 'local' } = options;
  const storage = getStorage(storageType);

  if (!storage) {
    return false;
  }

  try {
    const item: StoredItem<T> = {
      value,
      timestamp: Date.now(),
      ...(ttl && { ttl }),
    };

    storage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    // Handle quota exceeded error
    console.error('Storage setItem error:', error);
    return false;
  }
}

/**
 * Removes an item from localStorage
 * @param key - Storage key to remove
 * @returns True if successful
 */
export function removeItem(key: string): boolean {
  const storage = getStorage('local');

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all items from localStorage
 * @returns True if successful
 */
export function clear(): boolean {
  const storage = getStorage('local');

  if (!storage) {
    return false;
  }

  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets an item from sessionStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Stored value or default
 */
export function getSessionItem<T>(key: string, defaultValue: T | null = null): T | null {
  const storage = getStorage('session');

  if (!storage) {
    return defaultValue;
  }

  try {
    const item = storage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    const parsed: StoredItem<T> = JSON.parse(item);
    return parsed.value;
  } catch {
    try {
      const rawItem = storage.getItem(key);
      return rawItem !== null ? (JSON.parse(rawItem) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

/**
 * Sets an item in sessionStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns True if successful
 */
export function setSessionItem<T>(key: string, value: T): boolean {
  return setItem(key, value, { storageType: 'session' });
}

/**
 * Removes an item from sessionStorage
 * @param key - Storage key to remove
 * @returns True if successful
 */
export function removeSessionItem(key: string): boolean {
  const storage = getStorage('session');

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all items from sessionStorage
 * @returns True if successful
 */
export function clearSession(): boolean {
  const storage = getStorage('session');

  if (!storage) {
    return false;
  }

  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all keys from storage
 * @param storageType - Storage type (default: 'local')
 * @returns Array of storage keys
 */
export function getKeys(storageType: StorageType = 'local'): string[] {
  const storage = getStorage(storageType);

  if (!storage) {
    return [];
  }

  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key !== null) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Gets the size of stored data in bytes
 * @param storageType - Storage type (default: 'local')
 * @returns Size in bytes
 */
export function getStorageSize(storageType: StorageType = 'local'): number {
  const storage = getStorage(storageType);

  if (!storage) {
    return 0;
  }

  let totalSize = 0;

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      const value = storage.getItem(key) || '';
      totalSize += key.length + value.length;
    }
  }

  // Multiply by 2 for UTF-16 encoding
  return totalSize * 2;
}

/**
 * Checks if a key exists in storage
 * @param key - Storage key to check
 * @param storageType - Storage type (default: 'local')
 * @returns True if key exists
 */
export function hasItem(key: string, storageType: StorageType = 'local'): boolean {
  const storage = getStorage(storageType);

  if (!storage) {
    return false;
  }

  return storage.getItem(key) !== null;
}

/**
 * Gets multiple items from storage
 * @param keys - Array of storage keys
 * @param storageType - Storage type (default: 'local')
 * @returns Object with key-value pairs
 */
export function getItems<T>(
  keys: string[],
  storageType: StorageType = 'local'
): Record<string, T | null> {
  const result: Record<string, T | null> = {};

  keys.forEach((key) => {
    if (storageType === 'local') {
      result[key] = getItem<T>(key);
    } else {
      result[key] = getSessionItem<T>(key);
    }
  });

  return result;
}

/**
 * Sets multiple items in storage
 * @param items - Object with key-value pairs
 * @param options - Storage options
 * @returns True if all items were set successfully
 */
export function setItems<T>(
  items: Record<string, T>,
  options: StorageOptions = {}
): boolean {
  let success = true;

  Object.entries(items).forEach(([key, value]) => {
    if (!setItem(key, value, options)) {
      success = false;
    }
  });

  return success;
}
