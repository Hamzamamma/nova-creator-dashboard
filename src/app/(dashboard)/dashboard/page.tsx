"use client"

import { useEffect, useState } from "react"
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Icon,
  Spinner,
  Box,
  InlineGrid,
  Divider,
} from "@shopify/polaris"
import {
  CashDollarIcon,
  OrderIcon,
  PackageIcon,
  ProductIcon,
  ChartVerticalIcon,
} from "@shopify/polaris-icons"

interface HomeData {
  metrics: {
    totalRevenue: string
    totalOrders: number
    totalProducts: number
    fulfilledOrders: number
  }
  salesChartData: { day: string; sales: number }[]
  topProducts: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/shopify/home")
        const json = await res.json()
        if (json.success) {
          setData(json)
        }
      } catch (err) {
        console.error("Errore fetch:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Page title="Dashboard">
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    )
  }

  const stats = [
    {
      title: "Vendite Totali",
      value: "€" + (data?.metrics?.totalRevenue || "0.00"),
      icon: CashDollarIcon,
      status: "success" as const,
    },
    {
      title: "Ordini",
      value: data?.metrics?.totalOrders?.toString() || "0",
      icon: OrderIcon,
      status: "info" as const,
    },
    {
      title: "Ordini Evasi",
      value: data?.metrics?.fulfilledOrders?.toString() || "0",
      icon: PackageIcon,
      status: "success" as const,
    },
    {
      title: "Prodotti",
      value: data?.metrics?.totalProducts?.toString() || "0",
      icon: ProductIcon,
      status: "info" as const,
    },
  ]

  return (
    <Page
      title="Dashboard"
      subtitle="Panoramica delle tue vendite"
      primaryAction={{ content: "Aggiorna", onAction: () => window.location.reload() }}
    >
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
          {stats.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={stat.icon} tone="base" />
                    <Text as="span" variant="bodySm" tone="subdued">
                      {stat.title}
                    </Text>
                  </InlineStack>
                  <Badge tone={stat.status}>Live</Badge>
                </InlineStack>
                <Text as="p" variant="headingXl" fontWeight="semibold">
                  {stat.value}
                </Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">Vendite ultimi 7 giorni</Text>
                    <Text as="p" variant="bodySm" tone="subdued">Andamento delle vendite</Text>
                  </BlockStack>
                </InlineStack>
                <Divider />
                <Box minHeight="200px" padding="400">
                  <Text as="p" tone="subdued">Grafico vendite</Text>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Prodotti piu venduti</Text>
            <Divider />
            {data?.topProducts && data.topProducts.length > 0 ? (
              <BlockStack gap="300">
                {data.topProducts.slice(0, 5).map((product: any, index: number) => (
                  <InlineStack key={index} align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <Text as="span" variant="bodyMd">{index + 1}. {product.title || product.nome}</Text>
                    </InlineStack>
                    <Badge tone="success">{product.vendite || 0} vendite</Badge>
                  </InlineStack>
                ))}
              </BlockStack>
            ) : (
              <Text as="p" tone="subdued">Nessun prodotto venduto</Text>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
