"use client"

import { useEffect, useState } from "react"
import { Card, Text, InlineStack, BlockStack, Box, Badge, Icon, Spinner, Divider, ProgressBar } from "@shopify/polaris"
import { CashDollarIcon } from "@shopify/polaris-icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FinanceData {
  metrics: {
    totalRevenue: string
    totalDiscounts: string
    totalRefunds: string
    avgOrderValue: string
    ordersCount: number
  }
  aovChartData: { giorno: string; aov: number }[]
  channelData: { channel: string; revenue: number; orders: number }[]
}

export default function FinanzePage() {
  const [data, setData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/shopify/analytics")
        const json = await res.json()
        if (json.success) {
          setData(json)
        }
      } catch (err) {
        console.error("Errore:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Spinner size="large" />
      </div>
    )
  }

  const revenue = parseFloat(data?.metrics?.totalRevenue || "0")
  const discounts = parseFloat(data?.metrics?.totalDiscounts || "0")
  const refunds = parseFloat(data?.metrics?.totalRefunds || "0")
  const netRevenue = revenue - discounts - refunds
  const euro = String.fromCharCode(8364)
  const maxChannelRevenue = Math.max(...(data?.channelData?.map(c => c.revenue) || [1]))

  return (
    <div style={{ padding: "0 24px" }}>
      <BlockStack gap="600">
        <InlineStack gap="300" blockAlign="center">
          <Icon source={CashDollarIcon} tone="base" />
          <Text as="h1" variant="headingXl">Finanze</Text>
        </InlineStack>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <Card padding="400">
            <BlockStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">Fatturato Lordo</Text>
              <Text as="p" variant="headingXl" fontWeight="semibold">{euro}{revenue.toFixed(2)}</Text>
            </BlockStack>
          </Card>
          <Card padding="400">
            <BlockStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">Sconti Applicati</Text>
              <Text as="p" variant="headingXl" fontWeight="semibold" tone="caution">-{euro}{discounts.toFixed(2)}</Text>
            </BlockStack>
          </Card>
          <Card padding="400">
            <BlockStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">Rimborsi</Text>
              <Text as="p" variant="headingXl" fontWeight="semibold" tone="critical">-{euro}{refunds.toFixed(2)}</Text>
            </BlockStack>
          </Card>
          <Card padding="400" background="bg-surface-success">
            <BlockStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">Guadagno Netto</Text>
              <Text as="p" variant="headingXl" fontWeight="semibold" tone="success">{euro}{netRevenue.toFixed(2)}</Text>
            </BlockStack>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Suddivisione Vendite</Text>
              <Divider />
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Fatturato lordo</Text>
                <Text as="span" fontWeight="medium">{euro}{revenue.toFixed(2)}</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Sconti</Text>
                <Text as="span" fontWeight="medium" tone="caution">-{euro}{discounts.toFixed(2)}</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Rimborsi</Text>
                <Text as="span" fontWeight="medium" tone="critical">-{euro}{refunds.toFixed(2)}</Text>
              </InlineStack>
              <Divider />
              <InlineStack align="space-between">
                <Text as="span" fontWeight="semibold">Guadagno netto</Text>
                <Text as="span" fontWeight="bold" tone="success">{euro}{netRevenue.toFixed(2)}</Text>
              </InlineStack>
            </BlockStack>
          </Card>
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Valore Medio Ordine</Text>
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <Text as="p" variant="heading2xl" fontWeight="bold">{euro}{data?.metrics?.avgOrderValue || "0.00"}</Text>
                <Box paddingBlockStart="200">
                  <Text as="span" tone="subdued">Su {data?.metrics?.ordersCount || 0} ordini</Text>
                </Box>
              </div>
            </BlockStack>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px" }}>
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">AOV nel Tempo</Text>
              <Text as="span" variant="bodySm" tone="subdued">Ultimi 7 giorni</Text>
              <div style={{ height: "250px", marginTop: "16px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.aovChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="giorno" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="aov" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </BlockStack>
          </Card>
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Vendite per Canale</Text>
              <BlockStack gap="400">
                {data?.channelData && data.channelData.length > 0 ? (
                  data.channelData.map((channel, index) => (
                    <BlockStack key={index} gap="200">
                      <InlineStack align="space-between">
                        <Text as="span" fontWeight="medium">{channel.channel}</Text>
                        <Text as="span" fontWeight="semibold">{euro}{channel.revenue.toFixed(2)}</Text>
                      </InlineStack>
                      <ProgressBar progress={(channel.revenue / maxChannelRevenue) * 100} size="small" tone="primary" />
                      <Text as="span" variant="bodySm" tone="subdued">{channel.orders} ordini</Text>
                    </BlockStack>
                  ))
                ) : (
                  <Text as="p" tone="subdued">Nessun dato</Text>
                )}
              </BlockStack>
            </BlockStack>
          </Card>
        </div>
      </BlockStack>
    </div>
  )
}
