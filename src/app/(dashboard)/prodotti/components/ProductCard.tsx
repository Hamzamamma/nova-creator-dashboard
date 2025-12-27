"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Thumbnail,
  Box,
  Checkbox,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import {
  EditIcon,
  DeleteIcon,
  ImageIcon,
  InventoryIcon,
} from "@shopify/polaris-icons";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  selected,
  onSelect,
  onDelete,
  viewMode = "grid",
}: ProductCardProps) {
  const router = useRouter();

  const handleEdit = useCallback(() => {
    router.push(`/prodotti/${product.id}`);
  }, [router, product.id]);

  const handleSelectChange = useCallback(
    (checked: boolean) => {
      onSelect(product.id, checked);
    },
    [onSelect, product.id]
  );

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return <Badge tone="success">Attivo</Badge>;
      case "draft":
        return <Badge tone="warning">Bozza</Badge>;
      case "archived":
        return <Badge tone="info">Archiviato</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStockBadge = () => {
    if (product.quantity === 0) {
      return <Badge tone="critical">Esaurito</Badge>;
    }
    if (product.quantity <= 10) {
      return <Badge tone="attention">Scorte basse</Badge>;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const thumbnailSource = product.featuredImage || "";

  if (viewMode === "list") {
    return (
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e1e3e5",
          backgroundColor: selected ? "#f6f6f7" : "transparent",
        }}
      >
        <InlineStack gap="400" blockAlign="center" align="space-between">
          <InlineStack gap="400" blockAlign="center">
            <Checkbox
              label=""
              labelHidden
              checked={selected}
              onChange={handleSelectChange}
            />
            <div style={{ width: "48px", height: "48px" }}>
              {thumbnailSource ? (
                <Thumbnail
                  source={thumbnailSource}
                  alt={product.title}
                  size="small"
                />
              ) : (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#f6f6f7",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon source={ImageIcon} tone="subdued" />
                </div>
              )}
            </div>
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                {product.title}
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                SKU: {product.sku}
              </Text>
            </BlockStack>
          </InlineStack>

          <InlineStack gap="400" blockAlign="center">
            <div style={{ minWidth: "100px" }}>
              {getStatusBadge(product.status)}
            </div>
            <div style={{ minWidth: "80px", textAlign: "right" }}>
              <BlockStack gap="050">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  {formatPrice(product.price)}
                </Text>
                {product.compareAtPrice && (
                  <Text
                    as="span"
                    variant="bodySm"
                    tone="subdued"
                    textDecorationLine="line-through"
                  >
                    {formatPrice(product.compareAtPrice)}
                  </Text>
                )}
              </BlockStack>
            </div>
            <div style={{ minWidth: "100px" }}>
              <InlineStack gap="200" blockAlign="center">
                <Icon source={InventoryIcon} tone="subdued" />
                <Text as="span" variant="bodySm">
                  {product.quantity}
                </Text>
                {getStockBadge()}
              </InlineStack>
            </div>
            <InlineStack gap="200">
              <Tooltip content="Modifica">
                <Button icon={EditIcon} onClick={handleEdit} variant="plain" />
              </Tooltip>
              <Tooltip content="Elimina">
                <Button
                  icon={DeleteIcon}
                  onClick={() => onDelete(product.id)}
                  variant="plain"
                  tone="critical"
                />
              </Tooltip>
            </InlineStack>
          </InlineStack>
        </InlineStack>
      </div>
    );
  }

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="start">
          <Checkbox
            label=""
            labelHidden
            checked={selected}
            onChange={handleSelectChange}
          />
          <InlineStack gap="200">
            {getStatusBadge(product.status)}
            {getStockBadge()}
          </InlineStack>
        </InlineStack>

        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            backgroundColor: "#f6f6f7",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {thumbnailSource ? (
            <img
              src={thumbnailSource}
              alt={product.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Icon source={ImageIcon} tone="subdued" />
          )}
        </div>

        <BlockStack gap="100">
          <Text as="h3" variant="bodyMd" fontWeight="semibold">
            {product.title}
          </Text>
          <Text as="p" variant="bodySm" tone="subdued">
            {product.vendor}
          </Text>
        </BlockStack>

        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="050">
            <Text as="span" variant="bodyLg" fontWeight="bold">
              {formatPrice(product.price)}
            </Text>
            {product.compareAtPrice && (
              <Text
                as="span"
                variant="bodySm"
                tone="subdued"
                textDecorationLine="line-through"
              >
                {formatPrice(product.compareAtPrice)}
              </Text>
            )}
          </BlockStack>
          <InlineStack gap="100" blockAlign="center">
            <Icon source={InventoryIcon} tone="subdued" />
            <Text as="span" variant="bodySm" tone="subdued">
              {product.quantity} in stock
            </Text>
          </InlineStack>
        </InlineStack>

        {product.variants.length > 0 && (
          <Text as="p" variant="bodySm" tone="subdued">
            {product.variants.length} varianti
          </Text>
        )}

        <Box paddingBlockStart="200">
          <InlineStack gap="200" align="end">
            <Button onClick={handleEdit} icon={EditIcon}>
              Modifica
            </Button>
            <Button
              onClick={() => onDelete(product.id)}
              icon={DeleteIcon}
              tone="critical"
              variant="plain"
            />
          </InlineStack>
        </Box>
      </BlockStack>
    </Card>
  );
}
