"use client"

import { Card, Text, InlineStack, BlockStack, Box, Badge, Icon } from "@shopify/polaris"
import { CashDollarIcon, OrderIcon, PackageIcon, ProductIcon } from "@shopify/polaris-icons"

interface SectionCardsProps {
  metrics?: {
    totalRevenue: string
    totalOrders: number
    totalProducts: number
    fulfilledOrders: number
  }
}

export function SectionCards({ metrics }: SectionCardsProps) {
  const cards = [
    {
      title: "Vendite Totali",
      value: String.fromCharCode(8364) + (metrics?.totalRevenue || "0.00"),
      icon: CashDollarIcon,
      subtitle: "Fatturato lordo",
    },
    {
      title: "Ordini",
      value: metrics?.totalOrders?.toString() || "0",
      icon: OrderIcon,
      subtitle: "Ordini totali",
    },
    {
      title: "Ordini Evasi",
      value: metrics?.fulfilledOrders?.toString() || "0",
      icon: PackageIcon,
      subtitle: "Completati",
    },
    {
      title: "Prodotti",
      value: metrics?.totalProducts?.toString() || "0",
      icon: ProductIcon,
      subtitle: "In catalogo",
    },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {cards.map((card, index) => (
        <Card key={index} padding="400">
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={card.icon} tone="base" />
                <Text as="span" variant="bodySm" tone="subdued">
                  {card.title}
                </Text>
              </InlineStack>
              <Badge tone="info">Live</Badge>
            </InlineStack>
            <Text as="p" variant="headingXl" fontWeight="semibold">
              {card.value}
            </Text>
            <Text as="span" variant="bodySm" tone="subdued">
              {card.subtitle}
            </Text>
          </BlockStack>
        </Card>
      ))}
    </div>
  )
}
