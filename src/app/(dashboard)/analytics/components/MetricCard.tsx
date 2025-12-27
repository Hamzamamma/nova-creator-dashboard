"use client";

import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Icon,
  Badge,
  Box,
  Tooltip,
} from "@shopify/polaris";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  InfoIcon,
} from "@shopify/polaris-icons";
type IconSource = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
import type { MetricData } from "../types";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconSource;
  metric?: MetricData;
  format?: "currency" | "number" | "percentage";
  description?: string;
  loading?: boolean;
  showTrend?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  icon,
  metric,
  format = "number",
  description,
  loading = false,
  showTrend = true,
  size = "medium",
  onClick,
}: MetricCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val);
      case "percentage":
        return `${val.toFixed(2)}%`;
      case "number":
      default:
        return new Intl.NumberFormat("it-IT").format(val);
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return ArrowUpIcon;
      case "down":
        return ArrowDownIcon;
      default:
        return MinusIcon;
    }
  };

  const getTrendColor = (trend?: "up" | "down" | "neutral", inverted = false) => {
    if (!trend || trend === "neutral") return "subdued";
    if (inverted) {
      return trend === "up" ? "critical" : "success";
    }
    return trend === "up" ? "success" : "critical";
  };

  const getTrendBadgeTone = (trend?: "up" | "down" | "neutral", inverted = false): "success" | "critical" | "attention" => {
    if (!trend || trend === "neutral") return "attention";
    if (inverted) {
      return trend === "up" ? "critical" : "success";
    }
    return trend === "up" ? "success" : "critical";
  };

  const getValueVariant = () => {
    switch (size) {
      case "small":
        return "headingLg" as const;
      case "large":
        return "heading2xl" as const;
      case "medium":
      default:
        return "headingXl" as const;
    }
  };

  const cardContent = (
    <Card>
      <BlockStack gap="300">
        {/* Header with icon and title */}
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <Box
              background="bg-surface-secondary"
              borderRadius="200"
              padding="200"
            >
              <Icon source={icon} tone="base" />
            </Box>
            <Text as="span" variant="bodySm" tone="subdued">
              {title}
            </Text>
          </InlineStack>
          {description && (
            <Tooltip content={description}>
              <div style={{ cursor: "help" }}>
                <Icon source={InfoIcon} tone="subdued" />
              </div>
            </Tooltip>
          )}
        </InlineStack>

        {/* Main value */}
        {loading ? (
          <Box minHeight="40px">
            <div
              style={{
                width: "60%",
                height: "32px",
                backgroundColor: "var(--p-color-bg-surface-secondary)",
                borderRadius: "8px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </Box>
        ) : (
          <Text as="p" variant={getValueVariant()} fontWeight="bold">
            {formatValue(value)}
          </Text>
        )}

        {/* Trend indicator */}
        {showTrend && metric && !loading && (
          <InlineStack gap="200" blockAlign="center">
            <Badge tone={getTrendBadgeTone(metric.trend)}>
              <InlineStack gap="100" blockAlign="center">
                <Icon source={getTrendIcon(metric.trend)} />
                <span>
                  {metric.changePercent >= 0 ? "+" : ""}
                  {metric.changePercent.toFixed(1)}%
                </span>
              </InlineStack>
            </Badge>
            <Text as="span" variant="bodySm" tone="subdued">
              vs periodo precedente
            </Text>
          </InlineStack>
        )}

        {/* Previous value comparison */}
        {showTrend && metric && !loading && (
          <InlineStack gap="100" blockAlign="center">
            <Text as="span" variant="bodySm" tone="subdued">
              Prima: {formatValue(metric.previousValue)}
            </Text>
            <Text
              as="span"
              variant="bodySm"
              tone={getTrendColor(metric.trend)}
            >
              ({metric.change >= 0 ? "+" : ""}
              {format === "currency"
                ? formatValue(metric.change)
                : format === "percentage"
                ? `${metric.change.toFixed(2)}%`
                : metric.change.toLocaleString("it-IT")}
              )
            </Text>
          </InlineStack>
        )}
      </BlockStack>
    </Card>
  );

  if (onClick) {
    return (
      <div
        onClick={onClick}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

// Smaller variant for compact displays
export function MetricCardCompact({
  title,
  value,
  icon,
  changePercent,
  trend,
  format = "number",
}: {
  title: string;
  value: string | number;
  icon: IconSource;
  changePercent?: number;
  trend?: "up" | "down" | "neutral";
  format?: "currency" | "number" | "percentage";
}) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "number":
      default:
        return new Intl.NumberFormat("it-IT").format(val);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return ArrowUpIcon;
      case "down":
        return ArrowDownIcon;
      default:
        return MinusIcon;
    }
  };

  const getTrendTone = (): "success" | "critical" | "attention" => {
    if (!trend || trend === "neutral") return "attention";
    return trend === "up" ? "success" : "critical";
  };

  return (
    <Card padding="300">
      <InlineStack align="space-between" blockAlign="center" wrap={false}>
        <InlineStack gap="200" blockAlign="center">
          <Icon source={icon} tone="subdued" />
          <BlockStack gap="100">
            <Text as="span" variant="bodySm" tone="subdued">
              {title}
            </Text>
            <Text as="p" variant="headingMd" fontWeight="semibold">
              {formatValue(value)}
            </Text>
          </BlockStack>
        </InlineStack>
        {changePercent !== undefined && trend && (
          <Badge tone={getTrendTone()}>
            <InlineStack gap="050" blockAlign="center">
              <Icon source={getTrendIcon()} />
              <span>{changePercent >= 0 ? "+" : ""}{changePercent.toFixed(1)}%</span>
            </InlineStack>
          </Badge>
        )}
      </InlineStack>
    </Card>
  );
}

// Metric card for displaying a simple stat without trend
export function MetricCardSimple({
  title,
  value,
  icon,
  tone = "info",
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: IconSource;
  tone?: "success" | "info" | "warning" | "critical";
  subtitle?: string;
}) {
  const getBadgeTone = (): "success" | "info" | "warning" | "critical" => {
    return tone;
  };

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <Icon source={icon} tone="base" />
            <Text as="span" variant="bodySm" tone="subdued">
              {title}
            </Text>
          </InlineStack>
          <Badge tone={getBadgeTone()}>Live</Badge>
        </InlineStack>
        <Text as="p" variant="headingXl" fontWeight="semibold">
          {typeof value === "number" ? value.toLocaleString("it-IT") : value}
        </Text>
        {subtitle && (
          <Text as="p" variant="bodySm" tone="subdued">
            {subtitle}
          </Text>
        )}
      </BlockStack>
    </Card>
  );
}

export default MetricCard;
