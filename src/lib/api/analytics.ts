/**
 * Analytics API Service
 * Handles all analytics-related API operations for the Nova Dashboard
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface DateRange {
  start: string;
  end: string;
}

export interface MetricData {
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface RevenueMetrics {
  totalRevenue: MetricData;
  averageOrderValue: MetricData;
  grossProfit: MetricData;
  netProfit: MetricData;
  refunds: MetricData;
}

export interface OrderMetrics {
  totalOrders: MetricData;
  completedOrders: MetricData;
  pendingOrders: MetricData;
  cancelledOrders: MetricData;
  returnedOrders: MetricData;
  fulfillmentRate: MetricData;
}

export interface CustomerMetrics {
  totalCustomers: MetricData;
  newCustomers: MetricData;
  returningCustomers: MetricData;
  averageLifetimeValue: MetricData;
  acquisitionCost: MetricData;
  repeatPurchaseRate: MetricData;
  churnRate: MetricData;
}

export interface ConversionMetrics {
  conversionRate: MetricData;
  cartAbandonmentRate: MetricData;
  checkoutCompletionRate: MetricData;
  addToCartRate: MetricData;
}

export interface TrafficMetrics {
  totalVisitors: MetricData;
  uniqueVisitors: MetricData;
  pageViews: MetricData;
  averageSessionDuration: MetricData;
  bounceRate: MetricData;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  value: number;
  previousValue?: number;
}

export interface TimeSeriesData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string;
  category: string;
  salesCount: number;
  revenue: number;
  trend: 'up' | 'down' | 'neutral';
  changePercent: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'vip' | 'regular' | 'new' | 'at-risk';
}

export interface TrafficSource {
  source: string;
  visitors: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  percentage: number;
}

export interface SalesByLocation {
  region: string;
  country: string;
  countryCode: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export interface SalesByCategory {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
  growth: number;
}

export interface SalesByChannel {
  channel: string;
  orders: number;
  revenue: number;
  percentage: number;
  growth: number;
}

export interface HourlyDistribution {
  hour: number;
  orders: number;
  revenue: number;
}

export interface DayOfWeekDistribution {
  day: string;
  dayIndex: number;
  orders: number;
  revenue: number;
}

export interface DiscountAnalysis {
  totalDiscounts: number;
  ordersWithDiscount: number;
  ordersWithDiscountPercentage: number;
  averageDiscount: number;
  topDiscountCodes: { code: string; uses: number; revenue: number }[];
  revenueImpact: number;
}

export interface RefundAnalysis {
  totalRefunds: number;
  refundCount: number;
  averageRefundAmount: number;
  refundRate: number;
  topRefundReasons: { reason: string; count: number; amount: number }[];
}

export interface CustomerSegmentAnalysis {
  segment: string;
  count: number;
  percentage: number;
  averageOrderValue: number;
  totalRevenue: number;
  description: string;
}

export interface ProductPerformance {
  product: TopProduct;
  viewCount: number;
  addToCartCount: number;
  purchaseCount: number;
  conversionRate: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface AnalyticsDashboardData {
  dateRange: DateRange;
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
  conversion: ConversionMetrics;
  traffic?: TrafficMetrics;
  revenueChart: TimeSeriesData;
  ordersChart: TimeSeriesData;
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  trafficSources: TrafficSource[];
  salesByLocation: SalesByLocation[];
  salesByCategory: SalesByCategory[];
  salesByChannel: SalesByChannel[];
  hourlyDistribution?: HourlyDistribution[];
  dayOfWeekDistribution?: DayOfWeekDistribution[];
  discountAnalysis?: DiscountAnalysis;
  refundAnalysis?: RefundAnalysis;
  customerSegments?: CustomerSegmentAnalysis[];
}

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'customers' | 'products' | 'financial' | 'custom';
  sections: string[];
  filters?: Record<string, unknown>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
    recipients: string[];
  };
}

export interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  format: 'csv' | 'pdf' | 'xlsx';
  dateRange: DateRange;
  generatedAt: string;
  size: string;
  downloadUrl: string;
  expiresAt: string;
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/analytics`;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// =============================================================================
// ANALYTICS DASHBOARD API FUNCTIONS
// =============================================================================

/**
 * Get complete dashboard analytics data
 */
export async function getDashboardAnalytics(
  dateRange: DateRange,
  compareWithPrevious: boolean = true
): Promise<AnalyticsDashboardData> {
  const params = {
    startDate: dateRange.start,
    endDate: dateRange.end,
    compare: compareWithPrevious,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ANALYTICS_ENDPOINT}/dashboard${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<AnalyticsDashboardData>(response);
}

/**
 * Get revenue metrics
 */
export async function getRevenueMetrics(dateRange: DateRange): Promise<RevenueMetrics> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/revenue${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<RevenueMetrics>(response);
}

/**
 * Get order metrics
 */
export async function getOrderMetrics(dateRange: DateRange): Promise<OrderMetrics> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/orders${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<OrderMetrics>(response);
}

/**
 * Get customer metrics
 */
export async function getCustomerMetrics(dateRange: DateRange): Promise<CustomerMetrics> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/customers${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<CustomerMetrics>(response);
}

/**
 * Get conversion metrics
 */
export async function getConversionMetrics(dateRange: DateRange): Promise<ConversionMetrics> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/conversion${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ConversionMetrics>(response);
}

/**
 * Get traffic metrics
 */
export async function getTrafficMetrics(dateRange: DateRange): Promise<TrafficMetrics> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/traffic${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TrafficMetrics>(response);
}

// =============================================================================
// CHART DATA API FUNCTIONS
// =============================================================================

/**
 * Get revenue chart data
 */
export async function getRevenueChart(
  dateRange: DateRange,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<ChartDataPoint[]> {
  const params = {
    startDate: dateRange.start,
    endDate: dateRange.end,
    granularity,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ANALYTICS_ENDPOINT}/charts/revenue${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ChartDataPoint[]>(response);
}

/**
 * Get orders chart data
 */
export async function getOrdersChart(
  dateRange: DateRange,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<ChartDataPoint[]> {
  const params = {
    startDate: dateRange.start,
    endDate: dateRange.end,
    granularity,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ANALYTICS_ENDPOINT}/charts/orders${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ChartDataPoint[]>(response);
}

// =============================================================================
// TOP PERFORMERS API FUNCTIONS
// =============================================================================

/**
 * Get top products
 */
export async function getTopProducts(
  dateRange: DateRange,
  limit: number = 10,
  sortBy: 'revenue' | 'salesCount' = 'revenue'
): Promise<TopProduct[]> {
  const params = {
    startDate: dateRange.start,
    endDate: dateRange.end,
    limit,
    sortBy,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ANALYTICS_ENDPOINT}/top-products${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TopProduct[]>(response);
}

/**
 * Get top customers
 */
export async function getTopCustomers(
  dateRange: DateRange,
  limit: number = 10,
  sortBy: 'totalSpent' | 'totalOrders' = 'totalSpent'
): Promise<TopCustomer[]> {
  const params = {
    startDate: dateRange.start,
    endDate: dateRange.end,
    limit,
    sortBy,
  };

  const queryString = buildQueryString(params);
  const response = await fetch(`${ANALYTICS_ENDPOINT}/top-customers${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TopCustomer[]>(response);
}

/**
 * Get product performance details
 */
export async function getProductPerformance(
  productId: string,
  dateRange: DateRange
): Promise<ProductPerformance> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/products/${productId}/performance${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ProductPerformance>(response);
}

// =============================================================================
// BREAKDOWN ANALYTICS API FUNCTIONS
// =============================================================================

/**
 * Get sales by location
 */
export async function getSalesByLocation(dateRange: DateRange): Promise<SalesByLocation[]> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/breakdown/location${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<SalesByLocation[]>(response);
}

/**
 * Get sales by category
 */
export async function getSalesByCategory(dateRange: DateRange): Promise<SalesByCategory[]> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/breakdown/category${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<SalesByCategory[]>(response);
}

/**
 * Get traffic sources
 */
export async function getTrafficSources(dateRange: DateRange): Promise<TrafficSource[]> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/breakdown/traffic-sources${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TrafficSource[]>(response);
}

/**
 * Get discount analysis
 */
export async function getDiscountAnalysis(dateRange: DateRange): Promise<DiscountAnalysis> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/breakdown/discounts${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<DiscountAnalysis>(response);
}

/**
 * Get refund analysis
 */
export async function getRefundAnalysis(dateRange: DateRange): Promise<RefundAnalysis> {
  const params = { startDate: dateRange.start, endDate: dateRange.end };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/breakdown/refunds${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<RefundAnalysis>(response);
}

// =============================================================================
// REPORTS API FUNCTIONS
// =============================================================================

/**
 * Generate a report
 */
export async function generateReport(
  config: Omit<ReportConfig, 'id'>,
  dateRange: DateRange,
  format: 'csv' | 'pdf' | 'xlsx' = 'pdf'
): Promise<GeneratedReport> {
  const response = await fetch(`${ANALYTICS_ENDPOINT}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ config, dateRange, format }),
  });

  return handleResponse<GeneratedReport>(response);
}

/**
 * Get report history
 */
export async function getReportHistory(limit: number = 10): Promise<GeneratedReport[]> {
  const params = { limit };
  const queryString = buildQueryString(params);

  const response = await fetch(`${ANALYTICS_ENDPOINT}/reports/history${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<GeneratedReport[]>(response);
}

/**
 * Schedule a recurring report
 */
export async function scheduleReport(config: ReportConfig): Promise<ReportConfig> {
  const response = await fetch(`${ANALYTICS_ENDPOINT}/reports/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  return handleResponse<ReportConfig>(response);
}

/**
 * Get scheduled reports
 */
export async function getScheduledReports(): Promise<ReportConfig[]> {
  const response = await fetch(`${ANALYTICS_ENDPOINT}/reports/scheduled`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ReportConfig[]>(response);
}

/**
 * Delete a scheduled report
 */
export async function deleteScheduledReport(reportId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${ANALYTICS_ENDPOINT}/reports/scheduled/${reportId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ success: boolean }>(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const analyticsApi = {
  // Dashboard
  getDashboardAnalytics,
  getRevenueMetrics,
  getOrderMetrics,
  getCustomerMetrics,
  getConversionMetrics,
  getTrafficMetrics,

  // Charts
  getRevenueChart,
  getOrdersChart,

  // Top Performers
  getTopProducts,
  getTopCustomers,
  getProductPerformance,

  // Breakdowns
  getSalesByLocation,
  getSalesByCategory,
  getTrafficSources,
  getDiscountAnalysis,
  getRefundAnalysis,

  // Reports
  generateReport,
  getReportHistory,
  scheduleReport,
  getScheduledReports,
  deleteScheduledReport,
};

export default analyticsApi;
