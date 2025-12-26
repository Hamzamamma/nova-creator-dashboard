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
  InlineGrid,
  Divider,
  DataTable,
  EmptyState,
} from "@shopify/polaris"
import {
  OrderIcon,
  PackageIcon,
  RefreshIcon,
  CheckCircleIcon,
  DeliveryIcon,
} from "@shopify/polaris-icons"

interface OrdersData {
  currency: string
  stats: {
    totalOrders: number
    totalItems: number
    refundedOrders: number
    fulfilledOrders: number
    deliveredOrders: number
    refundRate: string
    fulfillmentRate: string
  }
  chartData: { giorno: string; ordini: number }[]
  topProdotti: { nome: string; vendite: number }[]
  ordiniRecenti: {
    id: string
    prodotto: string
    cliente: string
    data: string
    stato: string
    totale: string
  }[]
}

function getStatoBadge(stato: string) {
  switch (stato) {
    case "consegnato":
      return <Badge tone="success">Consegnato</Badge>
    case "spedito":
      return <Badge tone="info">Spedito</Badge>
    case "in_lavorazione":
      return <Badge tone="warning">In lavorazione</Badge>
    case "annullato":
      return <Badge tone="critical">Annullato</Badge>
    default:
      return <Badge>{stato}</Badge>
  }
}

export default function OrdiniPage() {
  const [data, setData] = useState<OrdersData | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch("/api/shopify/orders")
      const json = await res.json()
      if (json.success) {
        setData(json)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Page title="Ordini">
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    )
  }

  const stats = data?.stats

  const statsCards = [
    { title: "Ordini", value: stats?.totalOrders || 0, icon: OrderIcon, sub: "Ordini totali" },
    { title: "Articoli", value: stats?.totalItems || 0, icon: PackageIcon, sub: "Prodotti venduti" },
    { title: "Resi", value: stats?.refundedOrders || 0, icon: RefreshIcon, sub: (stats?.refundRate || "0") + "% del totale" },
    { title: "Evasi", value: stats?.fulfilledOrders || 0, icon: CheckCircleIcon, sub: (stats?.fulfillmentRate || "0") + "% completati" },
    { title: "Consegnati", value: stats?.deliveredOrders || 0, icon: DeliveryIcon, sub: "Spedizioni completate" },
  ]

  const tableRows = data?.ordiniRecenti?.map((ordine) => [
    ordine.id,
    ordine.prodotto,
    ordine.cliente,
    ordine.data,
    ordine.stato,
    ordine.totale,
  ]) || []

  return (
    <Page
      title="Ordini"
      subtitle="Monitora gli ordini dei tuoi prodotti"
      primaryAction={{ content: "Aggiorna", onAction: fetchOrders }}
      secondaryActions={[{ content: "Esporta" }]}
    >
      <BlockStack gap="500">
        {/* Stats Cards */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} gap="400">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={stat.icon} tone="base" />
                    <Text as="span" variant="bodySm" tone="subdued">{stat.title}</Text>
                  </InlineStack>
                  <Badge tone="info">Live</Badge>
                </InlineStack>
                <Text as="p" variant="headingXl" fontWeight="semibold">{stat.value}</Text>
                <Text as="span" variant="bodySm" tone="subdued">{stat.sub}</Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Charts Row */}
        <Layout>
          <Layout.Section variant="twoThirds">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Andamento Ordini</Text>
                <Text as="p" variant="bodySm" tone="subdued">Ordini ricevuti negli ultimi 7 giorni</Text>
                <Divider />
                <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "8px", padding: "16px" }}>
                  {data?.chartData?.map((item, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{
                        height: Math.max(item.ordini * 30, 10) + "px",
                        backgroundColor: "#008060",
                        borderRadius: "4px 4px 0 0",
                        marginBottom: "8px",
                      }} />
                      <Text as="span" variant="bodySm" tone="subdued">{item.giorno}</Text>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Prodotti piu venduti</Text>
                <Divider />
                {data?.topProdotti && data.topProdotti.length > 0 ? (
                  <BlockStack gap="300">
                    {data.topProdotti.map((prodotto, index) => (
                      <InlineStack key={index} align="space-between" blockAlign="center">
                        <Text as="span" variant="bodyMd">{index + 1}. {prodotto.nome}</Text>
                        <Badge tone="success">{prodotto.vendite}</Badge>
                      </InlineStack>
                    ))}
                  </BlockStack>
                ) : (
                  <Text as="p" tone="subdued">Nessun prodotto venduto</Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Orders Table */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Ordini Recenti</Text>
            <Divider />
            {tableRows.length > 0 ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "numeric"]}
                headings={["Ordine", "Prodotto", "Cliente", "Data", "Stato", "Totale"]}
                rows={tableRows}
              />
            ) : (
              <EmptyState
                heading="Nessun ordine ancora"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Gli ordini appariranno qui quando riceverai il primo</p>
              </EmptyState>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
