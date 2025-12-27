"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Select,
} from "@shopify/polaris";
import type { ChartDataPoint } from "../types";

// Color palette for charts
const CHART_COLORS = {
  primary: "#008060",
  secondary: "#5C6AC4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#8b5cf6",
  pink: "#ec4899",
};

const PIE_COLORS = [
  "#008060",
  "#5C6AC4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface BaseChartProps {
  title: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
}

interface LineAreaChartProps extends BaseChartProps {
  data: ChartDataPoint[];
  showComparison?: boolean;
  format?: "currency" | "number" | "percentage";
  color?: string;
  gradientId?: string;
}

// Revenue/Sales Line Chart with Area Fill
export function RevenueChart({
  title,
  subtitle,
  data,
  showComparison = false,
  format = "currency",
  color = CHART_COLORS.primary,
  gradientId = "revenueGradient",
  height = 300,
  loading = false,
}: LineAreaChartProps) {
  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("it-IT");
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            {label}
          </Text>
          <BlockStack gap="100">
            {payload.map((entry: any, index: number) => (
              <Text
                key={index}
                as="p"
                variant="bodySm"
                tone={entry.dataKey === "previousValue" ? "subdued" : undefined}
              >
                {entry.dataKey === "previousValue" ? "Periodo prec.: " : "Attuale: "}
                {formatValue(entry.value)}
              </Text>
            ))}
          </BlockStack>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">{title}</Text>
            {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
          </BlockStack>
          <Box minHeight={`${height}px`} background="bg-surface-secondary" borderRadius="200">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${height}px`,
            }}>
              <Text as="p" tone="subdued">Caricamento...</Text>
            </div>
          </Box>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h2" variant="headingMd">{title}</Text>
          {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
        </BlockStack>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(v) => formatValue(v)}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              {showComparison && (
                <Area
                  type="monotone"
                  dataKey="previousValue"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fill="transparent"
                  name="Periodo precedente"
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                name="Attuale"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}

// Orders Bar Chart
export function OrdersBarChart({
  title,
  subtitle,
  data,
  showComparison = false,
  format = "number",
  color = CHART_COLORS.secondary,
  height = 300,
  loading = false,
}: LineAreaChartProps) {
  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("it-IT");
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            {label}
          </Text>
          <BlockStack gap="100">
            {payload.map((entry: any, index: number) => (
              <Text
                key={index}
                as="p"
                variant="bodySm"
                tone={entry.dataKey === "previousValue" ? "subdued" : undefined}
              >
                {entry.dataKey === "previousValue" ? "Periodo prec.: " : "Ordini: "}
                {formatValue(entry.value)}
              </Text>
            ))}
          </BlockStack>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">{title}</Text>
            {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
          </BlockStack>
          <Box minHeight={`${height}px`} background="bg-surface-secondary" borderRadius="200">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${height}px`,
            }}>
              <Text as="p" tone="subdued">Caricamento...</Text>
            </div>
          </Box>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h2" variant="headingMd">{title}</Text>
          {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
        </BlockStack>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(v) => formatValue(v)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              {showComparison && (
                <Bar
                  dataKey="previousValue"
                  fill="#d1d5db"
                  radius={[4, 4, 0, 0]}
                  name="Periodo precedente"
                />
              )}
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                name="Attuale"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}

// Pie/Donut Chart for category breakdowns
interface PieChartData {
  name: string;
  value: number;
  percentage?: number;
}

interface DonutChartProps extends BaseChartProps {
  data: PieChartData[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  format?: "currency" | "number" | "percentage";
}

export function DonutChart({
  title,
  subtitle,
  data,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  format = "number",
  height = 300,
  loading = false,
}: DonutChartProps) {
  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("it-IT");
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            {data.name}
          </Text>
          <Text as="p" variant="bodySm">
            {formatValue(data.value)}
            {data.percentage && ` (${data.percentage.toFixed(1)}%)`}
          </Text>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">{title}</Text>
            {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
          </BlockStack>
          <Box minHeight={`${height}px`} background="bg-surface-secondary" borderRadius="200">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${height}px`,
            }}>
              <Text as="p" tone="subdued">Caricamento...</Text>
            </div>
          </Box>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h2" variant="headingMd">{title}</Text>
          {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
        </BlockStack>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span style={{ color: "#374151", fontSize: "12px" }}>{value}</span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}

// Horizontal Bar Chart for rankings (top products, customers, etc.)
interface HorizontalBarData {
  name: string;
  value: number;
  secondaryValue?: number;
}

interface HorizontalBarChartProps extends BaseChartProps {
  data: HorizontalBarData[];
  format?: "currency" | "number" | "percentage";
  color?: string;
  showSecondary?: boolean;
  secondaryFormat?: "currency" | "number" | "percentage";
}

export function HorizontalBarChart({
  title,
  subtitle,
  data,
  format = "number",
  color = CHART_COLORS.primary,
  height = 300,
  loading = false,
}: HorizontalBarChartProps) {
  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("it-IT");
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            {label}
          </Text>
          <Text as="p" variant="bodySm">
            {formatValue(payload[0].value)}
          </Text>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">{title}</Text>
            {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
          </BlockStack>
          <Box minHeight={`${height}px`} background="bg-surface-secondary" borderRadius="200">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${height}px`,
            }}>
              <Text as="p" tone="subdued">Caricamento...</Text>
            </div>
          </Box>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h2" variant="headingMd">{title}</Text>
          {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
        </BlockStack>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(v) => formatValue(v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#374151" }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}

// Multi-line comparison chart
interface MultiLineData {
  label: string;
  [key: string]: string | number;
}

interface MultiLineChartProps extends BaseChartProps {
  data: MultiLineData[];
  lines: { key: string; name: string; color: string }[];
  format?: "currency" | "number" | "percentage";
}

export function MultiLineChart({
  title,
  subtitle,
  data,
  lines,
  format = "number",
  height = 300,
  loading = false,
}: MultiLineChartProps) {
  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("it-IT");
    }
  };

  if (loading) {
    return (
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">{title}</Text>
            {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
          </BlockStack>
          <Box minHeight={`${height}px`} background="bg-surface-secondary" borderRadius="200">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${height}px`,
            }}>
              <Text as="p" tone="subdued">Caricamento...</Text>
            </div>
          </Box>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h2" variant="headingMd">{title}</Text>
          {subtitle && <Text as="p" variant="bodySm" tone="subdued">{subtitle}</Text>}
        </BlockStack>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(v) => formatValue(v)}
                width={80}
              />
              <Tooltip
                formatter={(value: number, name: string) => [formatValue(value), name]}
              />
              <Legend />
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}

export { CHART_COLORS, PIE_COLORS };
export default RevenueChart;
