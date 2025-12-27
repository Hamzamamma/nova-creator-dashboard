"use client";

import { useCallback } from "react";
import {
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon,
  Box,
} from "@shopify/polaris";
import {
  AlertCircleIcon,
  ArrowDownIcon,
  EyeCheckMarkIcon,
  XIcon,
} from "@shopify/polaris-icons";
import type { InventoryAlert } from "../types";

interface LowStockAlertProps {
  alert: InventoryAlert;
  onDismiss: (alertId: string) => void;
  onViewItem: () => void;
}

export default function LowStockAlert({
  alert,
  onDismiss,
  onViewItem,
}: LowStockAlertProps) {
  const handleDismiss = useCallback(() => {
    onDismiss(alert.id);
  }, [alert.id, onDismiss]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAlertTone = () => {
    switch (alert.type) {
      case "out_of_stock":
        return "critical" as const;
      case "low_stock":
        return "warning" as const;
      case "overstock":
        return "info" as const;
      default:
        return "warning" as const;
    }
  };

  const getAlertLabel = () => {
    switch (alert.type) {
      case "out_of_stock":
        return "Esaurito";
      case "low_stock":
        return "Scorte basse";
      case "overstock":
        return "Sovrastoccaggio";
      default:
        return alert.type;
    }
  };

  const getAlertIcon = () => {
    switch (alert.type) {
      case "out_of_stock":
        return AlertCircleIcon;
      case "low_stock":
        return ArrowDownIcon;
      default:
        return AlertCircleIcon;
    }
  };

  const tone = getAlertTone();
  const backgroundColor =
    tone === "critical"
      ? "bg-surface-critical"
      : tone === "warning"
      ? "bg-surface-warning"
      : "bg-surface-info";

  return (
    <Box
      padding="300"
      background={backgroundColor}
      borderRadius="200"
      borderWidth="025"
      borderColor={
        tone === "critical"
          ? "border-critical"
          : tone === "warning"
          ? "border-warning"
          : "border-info"
      }
    >
      <InlineStack align="space-between" blockAlign="start" gap="300">
        <InlineStack gap="300" blockAlign="start">
          <Box>
            <Icon source={getAlertIcon()} tone={tone} />
          </Box>
          <BlockStack gap="100">
            <InlineStack gap="200" blockAlign="center">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                {alert.productTitle}
              </Text>
              <Badge tone={tone} size="small">
                {getAlertLabel()}
              </Badge>
            </InlineStack>
            <Text as="span" variant="bodySm" tone="subdued">
              SKU: {alert.sku}
            </Text>
            <Text as="span" variant="bodySm">
              {alert.message}
            </Text>
            <InlineStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">
                Stock attuale: {alert.currentQuantity}
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                |
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                Soglia: {alert.threshold}
              </Text>
            </InlineStack>
            <Text as="span" variant="bodySm" tone="subdued">
              {formatDate(alert.createdAt)}
            </Text>
          </BlockStack>
        </InlineStack>

        <InlineStack gap="200">
          <Button
            icon={EyeCheckMarkIcon}
            variant="plain"
            onClick={onViewItem}
            accessibilityLabel="Visualizza articolo"
          />
          <Button
            icon={XIcon}
            variant="plain"
            onClick={handleDismiss}
            accessibilityLabel="Ignora avviso"
          />
        </InlineStack>
      </InlineStack>
    </Box>
  );
}
