// Analytics TypeScript Interfaces
// Types for the Nova Dashboard Analytics System

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
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
}

export interface OrderMetrics {
  totalOrders: MetricData;
  completedOrders: MetricData;
  pendingOrders: MetricData;
  cancelledOrders: MetricData;
  returnedOrders: MetricData;
}

export interface CustomerMetrics {
  totalCustomers: MetricData;
  newCustomers: MetricData;
  returningCustomers: MetricData;
  averageLifetimeValue: MetricData;
  acquisitionCost: MetricData;
  repeatPurchaseRate: MetricData;
}

export interface ConversionMetrics {
  conversionRate: MetricData;
  cartAbandonmentRate: MetricData;
  checkoutCompletionRate: MetricData;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  value: number;
  previousValue?: number;
}

export interface RevenueChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface OrdersChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  salesCount: number;
  revenue: number;
  image?: string;
  category: string;
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
  customerSince: string;
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

export interface DiscountImpact {
  totalDiscounts: number;
  ordersWithDiscount: number;
  averageDiscount: number;
  discountPercentage: number;
  revenueImpact: number;
}

export interface RefundAnalysis {
  totalRefunds: number;
  refundCount: number;
  averageRefundAmount: number;
  refundRate: number;
  topRefundReasons: { reason: string; count: number; amount: number }[];
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  averageOrderValue: number;
  totalRevenue: number;
  description: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'customers' | 'products' | 'financial' | 'custom';
  frequency?: 'daily' | 'weekly' | 'monthly';
  lastGenerated?: string;
  isScheduled: boolean;
}

export interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  recipients: string[];
  format: 'csv' | 'pdf' | 'excel';
  isActive: boolean;
}

export interface ReportHistory {
  id: string;
  name: string;
  generatedAt: string;
  type: string;
  format: 'csv' | 'pdf' | 'excel';
  size: string;
  downloadUrl: string;
}

export interface AnalyticsData {
  dateRange: DateRange;
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
  conversion: ConversionMetrics;
  revenueChart: RevenueChartData;
  ordersChart: OrdersChartData;
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  trafficSources: TrafficSource[];
  salesByLocation: SalesByLocation[];
  salesByCategory: SalesByCategory[];
  salesByChannel: SalesByChannel[];
  discountImpact: DiscountImpact;
  refundAnalysis: RefundAnalysis;
  customerSegments: CustomerSegment[];
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange: DateRange;
  includeCharts: boolean;
  sections: string[];
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';
