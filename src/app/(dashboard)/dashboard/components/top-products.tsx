"use client"

import { Card, Text, BlockStack, InlineStack, Avatar, Badge } from "@shopify/polaris"

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: string
}

interface TopProductsProps {
  products?: TopProduct[]
}

export function TopProducts({ products = [] }: TopProductsProps) {
  const euro = String.fromCharCode(8364)
  
  if (products.length === 0) {
    return (
      <Card padding="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">Prodotti Più Venduti</Text>
          <Text as="p" tone="subdued">Nessun prodotto venduto ancora</Text>
        </BlockStack>
      </Card>
    )
  }

  return (
    <Card padding="400">
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">Prodotti Più Venduti</Text>
        <BlockStack gap="300">
          {products.slice(0, 5).map((product, index) => (
            <InlineStack key={product.id} align="space-between" blockAlign="center">
              <InlineStack gap="300" blockAlign="center">
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "8px", 
                  background: "#f1f1f1", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#666"
                }}>
                  {index + 1}
                </div>
                <BlockStack gap="050">
                  <Text as="span" variant="bodyMd" fontWeight="medium">{product.name}</Text>
                  <Text as="span" variant="bodySm" tone="subdued">{product.sales} venduti</Text>
                </BlockStack>
              </InlineStack>
              <Badge tone="success">{product.revenue}</Badge>
            </InlineStack>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  )
}
