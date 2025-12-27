"use client";

import { useState, useCallback } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Select,
  Button,
  Thumbnail,
  Box,
  Divider,
  Badge,
} from "@shopify/polaris";
import {
  DragHandleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import type { CollectionProduct, CollectionSortOption } from "../types";
import { SORT_OPTIONS } from "../types";

interface CollectionSortOrderProps {
  products: CollectionProduct[];
  sortOrder: CollectionSortOption;
  onSortOrderChange: (sortOrder: CollectionSortOption) => void;
  onProductsReorder: (products: CollectionProduct[]) => void;
  isManualCollection: boolean;
}

export function CollectionSortOrder({
  products,
  sortOrder,
  onSortOrderChange,
  onProductsReorder,
  isManualCollection,
}: CollectionSortOrderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sortOptions = SORT_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  const handleSortChange = useCallback(
    (value: string) => {
      onSortOrderChange(value as CollectionSortOption);
    },
    [onSortOrderChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newProducts = [...products];
      [newProducts[index - 1], newProducts[index]] = [
        newProducts[index],
        newProducts[index - 1],
      ];
      onProductsReorder(newProducts);
    },
    [products, onProductsReorder]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === products.length - 1) return;
      const newProducts = [...products];
      [newProducts[index], newProducts[index + 1]] = [
        newProducts[index + 1],
        newProducts[index],
      ];
      onProductsReorder(newProducts);
    },
    [products, onProductsReorder]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index.toString());
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

      if (dragIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newProducts = [...products];
      const [draggedItem] = newProducts.splice(dragIndex, 1);
      newProducts.splice(dropIndex, 0, draggedItem);

      onProductsReorder(newProducts);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [products, onProductsReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const isManualSort = sortOrder === "manual";

  const renderProductRow = (product: CollectionProduct, index: number) => {
    const isDragged = draggedIndex === index;
    const isDragOver = dragOverIndex === index;

    return (
      <div
        key={product.id}
        draggable={isManualSort && isManualCollection}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={handleDragEnd}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          backgroundColor: isDragOver
            ? "var(--p-color-bg-surface-info)"
            : isDragged
            ? "var(--p-color-bg-surface-secondary)"
            : "transparent",
          borderBottom: "1px solid var(--p-color-border-subdued)",
          opacity: isDragged ? 0.5 : 1,
          cursor: isManualSort && isManualCollection ? "grab" : "default",
          transition: "background-color 0.15s ease",
        }}
      >
        {isManualSort && isManualCollection && (
          <div
            style={{
              marginRight: "12px",
              color: "var(--p-color-icon-secondary)",
              cursor: "grab",
            }}
          >
            <DragHandleIcon width={20} height={20} />
          </div>
        )}

        <div style={{ marginRight: "12px", fontWeight: 500, width: "24px" }}>
          {index + 1}
        </div>

        {product.image ? (
          <Thumbnail source={product.image} alt={product.title} size="small" />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "var(--p-color-bg-surface-secondary)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon width={20} height={20} />
          </div>
        )}

        <div style={{ flex: 1, marginLeft: "12px" }}>
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {product.title}
          </Text>
          <InlineStack gap="200">
            <Text as="span" variant="bodySm" tone="subdued">
              EUR {product.price}
            </Text>
            <Badge
              tone={
                product.inventory > 10
                  ? "success"
                  : product.inventory > 0
                  ? "warning"
                  : "critical"
              }
            >
              {product.inventory} in stock
            </Badge>
          </InlineStack>
        </div>

        {isManualSort && isManualCollection && (
          <InlineStack gap="100">
            <Button
              icon={ChevronUpIcon}
              variant="tertiary"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              accessibilityLabel="Sposta su"
            />
            <Button
              icon={ChevronDownIcon}
              variant="tertiary"
              onClick={() => handleMoveDown(index)}
              disabled={index === products.length - 1}
              accessibilityLabel="Sposta giu"
            />
          </InlineStack>
        )}
      </div>
    );
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Ordinamento prodotti
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Definisci l'ordine in cui i prodotti vengono visualizzati
            </Text>
          </BlockStack>
        </InlineStack>

        <Select
          label="Ordina per"
          options={sortOptions}
          value={sortOrder}
          onChange={handleSortChange}
        />

        {isManualSort && !isManualCollection && (
          <Box padding="300" background="bg-surface-warning" borderRadius="200">
            <Text as="p" variant="bodySm">
              L'ordinamento manuale e disponibile solo per le collezioni manuali.
              Per le collezioni automatiche, i prodotti vengono ordinati
              automaticamente in base alla condizione selezionata.
            </Text>
          </Box>
        )}

        <Divider />

        {products.length > 0 ? (
          <>
            <Text as="span" variant="bodySm" tone="subdued">
              {products.length} prodott{products.length === 1 ? "o" : "i"}
              {isManualSort && isManualCollection && (
                <> - Trascina per riordinare</>
              )}
            </Text>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid var(--p-color-border-subdued)",
                borderRadius: "8px",
              }}
            >
              {products.map((product, index) => renderProductRow(product, index))}
            </div>
          </>
        ) : (
          <Box padding="400">
            <BlockStack gap="200" inlineAlign="center">
              <Text as="p" variant="bodyMd" tone="subdued">
                Nessun prodotto da ordinare
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Aggiungi prodotti alla collezione per definire l'ordine
              </Text>
            </BlockStack>
          </Box>
        )}
      </BlockStack>
    </Card>
  );
}

export default CollectionSortOrder;
