/**
 * Date Utilities for Nova Dashboard
 * Provides comprehensive date manipulation and formatting functions
 */

/**
 * Date range preset type
 */
export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last14days'
  | 'last30days'
  | 'last90days'
  | 'lastMonth'
  | 'lastQuarter'
  | 'lastYear'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'allTime';

/**
 * Date range type
 */
export interface DateRange {
  start: Date;
  end: Date;
  label?: string;
}

/**
 * Gets today's date at midnight (start of day)
 * @returns Date object for today at 00:00:00
 * @example getToday() // 2024-01-15T00:00:00.000Z
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Gets yesterday's date at midnight
 * @returns Date object for yesterday at 00:00:00
 */
export function getYesterday(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

/**
 * Gets the start of the current week (Sunday or Monday based on locale)
 * @param startOnMonday - Whether week starts on Monday (default: false)
 * @returns Date object for start of week
 */
export function getStartOfWeek(startOnMonday: boolean = false): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = startOnMonday
    ? dayOfWeek === 0 ? 6 : dayOfWeek - 1
    : dayOfWeek;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

/**
 * Gets the end of the current week
 * @param startOnMonday - Whether week starts on Monday (default: false)
 * @returns Date object for end of week
 */
export function getEndOfWeek(startOnMonday: boolean = false): Date {
  const startOfWeek = getStartOfWeek(startOnMonday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
}

/**
 * Gets the start of the current month
 * @returns Date object for start of month
 */
export function getStartOfMonth(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Gets the end of the current month
 * @returns Date object for end of month
 */
export function getEndOfMonth(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Gets the start of the current quarter
 * @returns Date object for start of quarter
 */
export function getStartOfQuarter(): Date {
  const today = new Date();
  const quarter = Math.floor(today.getMonth() / 3);
  return new Date(today.getFullYear(), quarter * 3, 1, 0, 0, 0, 0);
}

/**
 * Gets the end of the current quarter
 * @returns Date object for end of quarter
 */
export function getEndOfQuarter(): Date {
  const today = new Date();
  const quarter = Math.floor(today.getMonth() / 3);
  return new Date(today.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
}

/**
 * Gets the start of the current year
 * @returns Date object for start of year
 */
export function getStartOfYear(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
}

/**
 * Gets the end of the current year
 * @returns Date object for end of year
 */
export function getEndOfYear(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
}

/**
 * Gets a date range based on a preset
 * @param preset - Date range preset
 * @returns Date range object with start and end dates
 * @example getDateRange('last7days')
 */
export function getDateRange(preset: DateRangePreset): DateRange {
  const today = getToday();
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  switch (preset) {
    case 'today':
      return { start: today, end: now, label: 'Today' };

    case 'yesterday': {
      const yesterday = getYesterday();
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return { start: yesterday, end: yesterdayEnd, label: 'Yesterday' };
    }

    case 'last7days': {
      const start = subtractDays(today, 6);
      return { start, end: now, label: 'Last 7 Days' };
    }

    case 'last14days': {
      const start = subtractDays(today, 13);
      return { start, end: now, label: 'Last 14 Days' };
    }

    case 'last30days': {
      const start = subtractDays(today, 29);
      return { start, end: now, label: 'Last 30 Days' };
    }

    case 'last90days': {
      const start = subtractDays(today, 89);
      return { start, end: now, label: 'Last 90 Days' };
    }

    case 'lastMonth': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      return { start, end, label: 'Last Month' };
    }

    case 'lastQuarter': {
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const year = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
      const start = new Date(year, lastQuarter * 3, 1);
      const end = new Date(year, lastQuarter * 3 + 3, 0, 23, 59, 59, 999);
      return { start, end, label: 'Last Quarter' };
    }

    case 'lastYear': {
      const start = new Date(today.getFullYear() - 1, 0, 1);
      const end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      return { start, end, label: 'Last Year' };
    }

    case 'thisWeek':
      return { start: getStartOfWeek(), end: getEndOfWeek(), label: 'This Week' };

    case 'thisMonth':
      return { start: getStartOfMonth(), end: getEndOfMonth(), label: 'This Month' };

    case 'thisQuarter':
      return { start: getStartOfQuarter(), end: getEndOfQuarter(), label: 'This Quarter' };

    case 'thisYear':
      return { start: getStartOfYear(), end: getEndOfYear(), label: 'This Year' };

    case 'allTime':
      return {
        start: new Date(2020, 0, 1),
        end: now,
        label: 'All Time',
      };

    default:
      return { start: today, end: now, label: 'Today' };
  }
}

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = getToday();

  return isSameDay(dateObj, today);
}

/**
 * Checks if a date is yesterday
 * @param date - Date to check
 * @returns True if the date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const dateObj = date instanceof Date ? date : new Date(date);
  const yesterday = getYesterday();

  return isSameDay(dateObj, yesterday);
}

/**
 * Checks if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are the same day
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Checks if two dates are in the same month
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are in the same month
 */
export function isSameMonth(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
  );
}

/**
 * Adds days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date | string | number, days: number): Date {
  const result = date instanceof Date ? new Date(date) : new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtracts days from a date
 * @param date - Starting date
 * @param days - Number of days to subtract
 * @returns New date with days subtracted
 */
export function subtractDays(date: Date | string | number, days: number): Date {
  return addDays(date, -days);
}

/**
 * Adds months to a date
 * @param date - Starting date
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const result = date instanceof Date ? new Date(date) : new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Gets the number of days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates
 */
export function getDaysBetween(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a date range as a string
 * @param start - Start date
 * @param end - End date
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted date range string
 * @example formatDateRange(jan1, jan31) // "Jan 1 - 31, 2024"
 */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  locale: string = 'en-US'
): string {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (sameMonth) {
    return `${new Intl.DateTimeFormat(locale, formatOptions).format(startDate)} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  if (sameYear) {
    return `${new Intl.DateTimeFormat(locale, formatOptions).format(startDate)} - ${new Intl.DateTimeFormat(locale, formatOptions).format(endDate)}, ${endDate.getFullYear()}`;
  }

  const fullFormatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  return `${new Intl.DateTimeFormat(locale, fullFormatOptions).format(startDate)} - ${new Intl.DateTimeFormat(locale, fullFormatOptions).format(endDate)}`;
}

/**
 * Gets the ISO week number for a date
 * @param date - Date to get week number for
 * @returns Week number (1-53)
 */
export function getWeekNumber(date: Date | string | number): number {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);

  // Set to nearest Thursday (current date + 4 - current day number, making Sunday 7)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));

  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);

  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return weekNumber;
}

/**
 * Gets the quarter for a date (1-4)
 * @param date - Date to get quarter for
 * @returns Quarter number (1-4)
 */
export function getQuarter(date: Date | string | number): number {
  const d = date instanceof Date ? date : new Date(date);
  return Math.floor(d.getMonth() / 3) + 1;
}

/**
 * Gets the fiscal quarter (based on fiscal year start)
 * @param date - Date to get fiscal quarter for
 * @param fiscalYearStartMonth - Month fiscal year starts (0-11, default: 0 for January)
 * @returns Fiscal quarter number (1-4)
 */
export function getFiscalQuarter(
  date: Date | string | number,
  fiscalYearStartMonth: number = 0
): number {
  const d = date instanceof Date ? date : new Date(date);
  const month = d.getMonth();
  const adjustedMonth = (month - fiscalYearStartMonth + 12) % 12;
  return Math.floor(adjustedMonth / 3) + 1;
}

/**
 * Checks if a date is within a date range
 * @param date - Date to check
 * @param start - Range start date
 * @param end - Range end date
 * @returns True if date is within range (inclusive)
 */
export function isDateInRange(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
): boolean {
  const d = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const s = start instanceof Date ? start.getTime() : new Date(start).getTime();
  const e = end instanceof Date ? end.getTime() : new Date(end).getTime();

  return d >= s && d <= e;
}

/**
 * Gets an array of dates between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Array of dates
 */
export function getDatesBetween(
  start: Date | string | number,
  end: Date | string | number
): Date[] {
  const dates: Date[] = [];
  const currentDate = start instanceof Date ? new Date(start) : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns True if date is a weekend
 */
export function isWeekend(date: Date | string | number): boolean {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Gets the start of day for a date
 * @param date - Date to get start of day for
 * @returns Date at 00:00:00.000
 */
export function startOfDay(date: Date | string | number): Date {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets the end of day for a date
 * @param date - Date to get end of day for
 * @returns Date at 23:59:59.999
 */
export function endOfDay(date: Date | string | number): Date {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
