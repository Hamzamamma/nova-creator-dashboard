"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  FormLayout,
  Banner,
  Divider,
  Badge,
  InlineGrid,
  Icon,
  Box,
} from "@shopify/polaris";
import {
  InventoryIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AlertCircleIcon,
} from "@shopify/polaris-icons";
import type {
  InventoryItem,
  InventoryLocation,
  StockAdjustmentForm,
} from "../types";
import {
  ADJUSTMENT_TYPE_OPTIONS,
  ADJUSTMENT_REASON_OPTIONS,
  getStockStatusLabel,
  getStockStatusTone,
} from "../types";

interface StockAdjustModalProps {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  locations: InventoryLocation[];
  onStockAdjusted: (itemId: string, newQuantity: number) => void;
  isBulk?: boolean;
  bulkCount?: number;
}

export default function StockAdjustModal({
  open,
  onClose,
  item,
  locations,
  onStockAdjusted,
  isBulk = false,
  bulkCount = 0,
}: StockAdjustModalProps) {
  const [formData, setFormData] = useState<StockAdjustmentForm>({
    quantity: 0,
    adjustmentType: "set",
    locationId: "",
    reason: "inventory_count",
    reference: "",
  });
  const [quantityInput, setQuantityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && item) {
      setFormData({
        quantity: item.totalQuantity,
        adjustmentType: "set",
        locationId: locations[0]?.id || "",
        reason: "inventory_count",
        reference: "",
      });
      setQuantityInput(item.totalQuantity.toString());
      setErrors({});
    }
  }, [open, item, locations]);

  const locationOptions = useMemo(() => {
    return locations.map((loc) => ({
      label: loc.name,
      value: loc.id,
    }));
  }, [locations]);

  const newQuantity = useMemo(() => {
    if (!item) return 0;
    const inputQty = parseInt(quantityInput) || 0;

    switch (formData.adjustmentType) {
      case "set":
        return inputQty;
      case "add":
        return item.totalQuantity + inputQty;
      case "remove":
        return Math.max(0, item.totalQuantity - inputQty);
      default:
        return item.totalQuantity;
    }
  }, [item, quantityInput, formData.adjustmentType]);

  const quantityChange = useMemo(() => {
    if (!item) return 0;
    return newQuantity - item.totalQuantity;
  }, [item, newQuantity]);

  const newStatus = useMemo(() => {
    if (!item) return "in_stock" as const;
    if (newQuantity === 0) return "out_of_stock" as const;
    if (newQuantity <= item.reorderPoint) return "low_stock" as const;
    return "in_stock" as const;
  }, [newQuantity, item]);

  const handleFieldChange = useCallback(
    (field: keyof StockAdjustmentForm, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    []
  );

  const handleQuantityChange = useCallback((value: string) => {
    setQuantityInput(value);
    setErrors((prev) => ({ ...prev, quantity: "" }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const qty = parseInt(quantityInput);
    if (isNaN(qty) || qty < 0) {
      newErrors.quantity = "Inserisci una quantita valida";
    }

    if (formData.adjustmentType === "remove" && item) {
      if (qty > item.totalQuantity) {
        newErrors.quantity = `Non puoi rimuovere piu di ${item.totalQuantity} unita`;
      }
    }

    if (!formData.locationId) {
      newErrors.locationId = "Seleziona una posizione";
    }

    if (!formData.reason) {
      newErrors.reason = "Seleziona un motivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [quantityInput, formData, item]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !item) return;

    onStockAdjusted(item.id, newQuantity);
  }, [validate, item, newQuantity, onStockAdjusted]);

  if (!item) return null;

  const adjustmentTypeOptions = ADJUSTMENT_TYPE_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  const reasonOptions = ADJUSTMENT_REASON_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isBulk ? `Rettifica Stock (${bulkCount} articoli)` : "Rettifica Stock"}
      primaryAction={{
        content: "Conferma rettifica",
        onAction: handleSubmit,
        disabled: quantityChange === 0 && !isBulk,
      }}
      secondaryActions={[
        {
          content: "Annulla",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Product Info */}
          {!isBulk && (
            <Box
              padding="400"
              background="bg-surface-secondary"
              borderRadius="200"
            >
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  {item.productTitle}
                </Text>
                <InlineStack gap="200">
                  <Text as="span" variant="bodySm" tone="subdued">
                    SKU: {item.sku}
                  </Text>
                  <Badge tone={getStockStatusTone(item.status)}>
                    {getStockStatusLabel(item.status)}
                  </Badge>
                </InlineStack>
              </BlockStack>
            </Box>
          )}

          {isBulk && (
            <Banner>
              <p>
                Stai per modificare lo stock di {bulkCount} articoli
                contemporaneamente. La rettifica verra applicata a tutti gli
                articoli selezionati.
              </p>
            </Banner>
          )}

          {/* Current Stock Info */}
          {!isBulk && (
            <InlineGrid columns={3} gap="400">
              <BlockStack gap="100">
                <Text as="span" variant="bodySm" tone="subdued">
                  Stock Attuale
                </Text>
                <Text as="span" variant="headingMd" fontWeight="bold">
                  {item.totalQuantity}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="span" variant="bodySm" tone="subdued">
                  Disponibili
                </Text>
                <Text as="span" variant="headingMd">
                  {item.available}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="span" variant="bodySm" tone="subdued">
                  Riservati
                </Text>
                <Text as="span" variant="headingMd">
                  {item.reserved}
                </Text>
              </BlockStack>
            </InlineGrid>
          )}

          <Divider />

          {/* Adjustment Form */}
          <FormLayout>
            <Select
              label="Tipo di rettifica"
              options={adjustmentTypeOptions}
              value={formData.adjustmentType}
              onChange={(value) =>
                handleFieldChange("adjustmentType", value as "set" | "add" | "remove")
              }
              helpText={
                formData.adjustmentType === "set"
                  ? "Imposta la quantita esatta"
                  : formData.adjustmentType === "add"
                  ? "Aggiungi alla quantita esistente"
                  : "Rimuovi dalla quantita esistente"
              }
            />

            <TextField
              label={
                formData.adjustmentType === "set"
                  ? "Nuova quantita"
                  : formData.adjustmentType === "add"
                  ? "Quantita da aggiungere"
                  : "Quantita da rimuovere"
              }
              type="number"
              value={quantityInput}
              onChange={handleQuantityChange}
              error={errors.quantity}
              autoComplete="off"
              min={0}
              prefix={
                formData.adjustmentType === "add" ? (
                  <Icon source={ArrowUpIcon} tone="success" />
                ) : formData.adjustmentType === "remove" ? (
                  <Icon source={ArrowDownIcon} tone="critical" />
                ) : undefined
              }
            />

            <Select
              label="Posizione"
              options={locationOptions}
              value={formData.locationId}
              onChange={(value) => handleFieldChange("locationId", value)}
              error={errors.locationId}
            />

            <Select
              label="Motivo"
              options={reasonOptions}
              value={formData.reason}
              onChange={(value) => handleFieldChange("reason", value)}
              error={errors.reason}
            />

            <TextField
              label="Riferimento (opzionale)"
              value={formData.reference}
              onChange={(value) => handleFieldChange("reference", value)}
              placeholder="Es. PO-2024-001, Conteggio trimestrale"
              autoComplete="off"
            />
          </FormLayout>

          <Divider />

          {/* Preview Changes */}
          {!isBulk && (
            <Box
              padding="400"
              background={
                quantityChange > 0
                  ? "bg-surface-success"
                  : quantityChange < 0
                  ? "bg-surface-critical"
                  : "bg-surface-secondary"
              }
              borderRadius="200"
            >
              <BlockStack gap="300">
                <Text as="h4" variant="headingSm">
                  Anteprima Modifiche
                </Text>

                <InlineGrid columns={3} gap="400">
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Stock Attuale
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {item.totalQuantity}
                    </Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Variazione
                    </Text>
                    <InlineStack gap="100" blockAlign="center">
                      {quantityChange !== 0 && (
                        <Icon
                          source={quantityChange > 0 ? ArrowUpIcon : ArrowDownIcon}
                          tone={quantityChange > 0 ? "success" : "critical"}
                        />
                      )}
                      <Text
                        as="span"
                        variant="bodyMd"
                        fontWeight="semibold"
                        tone={
                          quantityChange > 0
                            ? "success"
                            : quantityChange < 0
                            ? "critical"
                            : undefined
                        }
                      >
                        {quantityChange > 0 ? "+" : ""}
                        {quantityChange}
                      </Text>
                    </InlineStack>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Nuovo Stock
                    </Text>
                    <Text as="span" variant="bodyMd" fontWeight="bold">
                      {newQuantity}
                    </Text>
                  </BlockStack>
                </InlineGrid>

                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Nuovo stato:
                  </Text>
                  <Badge tone={getStockStatusTone(newStatus)}>
                    {getStockStatusLabel(newStatus)}
                  </Badge>
                </InlineStack>

                {newQuantity === 0 && (
                  <Banner tone="critical" icon={AlertCircleIcon}>
                    <p>
                      Attenzione: questo prodotto risultera esaurito dopo la
                      rettifica.
                    </p>
                  </Banner>
                )}

                {newQuantity > 0 &&
                  newQuantity <= item.reorderPoint &&
                  item.totalQuantity > item.reorderPoint && (
                    <Banner tone="warning">
                      <p>
                        La nuova quantita sara sotto il punto di riordino (
                        {item.reorderPoint} unita).
                      </p>
                    </Banner>
                  )}
              </BlockStack>
            </Box>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
