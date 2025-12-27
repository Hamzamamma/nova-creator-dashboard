"use client"

import { useEffect, useState } from "react"
import {
  Page,
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
  Button,
  ProgressBar,
  Banner,
} from "@shopify/polaris"
import {
  CashDollarIcon,
  OrderIcon,
  PackageIcon,
  ProductIcon,
  ChartVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExternalIcon,
  PlusIcon,
  SettingsIcon,
  StoreIcon,
  PersonIcon,
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
  const euro = String.fromCharCode(8364)

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
      title: "Guadagni Totali",
      value: euro + (data?.metrics?.totalRevenue || "0.00"),
      icon: CashDollarIcon,
      change: "+12.5%",
      positive: true,
      color: "#008060",
    },
    {
      title: "Ordini",
      value: data?.metrics?.totalOrders?.toString() || "0",
      icon: OrderIcon,
      change: "+8",
      positive: true,
      color: "#2c6ecb",
    },
    {
      title: "Ordini Evasi",
      value: data?.metrics?.fulfilledOrders?.toString() || "0",
      icon: PackageIcon,
      change: "100%",
      positive: true,
      color: "#7c3aed",
    },
    {
      title: "Prodotti Attivi",
      value: data?.metrics?.totalProducts?.toString() || "0",
      icon: ProductIcon,
      change: "+2",
      positive: true,
      color: "#ea580c",
    },
  ]

  const quickActions = [
    { label: "Aggiungi prodotto", icon: PlusIcon, url: "/prodotti/nuovo" },
    { label: "Vedi ordini", icon: OrderIcon, url: "/ordini" },
    { label: "Guadagni", icon: CashDollarIcon, url: "/finanze" },
    { label: "Impostazioni", icon: SettingsIcon, url: "/settings" },
  ]

  const recentOrders = [
    { id: "#1234", customer: "Mario Rossi", amount: "45,00", status: "Evaso", time: "2 ore fa" },
    { id: "#1233", customer: "Anna Bianchi", amount: "89,00", status: "In elaborazione", time: "5 ore fa" },
    { id: "#1232", customer: "Luca Verdi", amount: "25,00", status: "Evaso", time: "Ieri" },
    { id: "#1231", customer: "Sara Neri", amount: "120,00", status: "Evaso", time: "Ieri" },
  ]

  const setupTasks = [
    { label: "Configura metodo di pagamento", completed: true },
    { label: "Aggiungi il primo prodotto", completed: true },
    { label: "Personalizza il negozio", completed: false },
    { label: "Collega i social media", completed: false },
  ]

  const completedTasks = setupTasks.filter(t => t.completed).length
  const progressPercent = (completedTasks / setupTasks.length) * 100

  return (
    <Page
      title="Bentornato, Hamza!"
      subtitle={new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      primaryAction={{ content: "Vedi negozio", icon: ExternalIcon, url: "#" }}
    >
      <BlockStack gap="600">
        {/* Stats Cards */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
          {stats.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Box
                    padding="200"
                    borderRadius="200"
                    background="bg-surface-secondary"
                  >
                    <Icon source={stat.icon} tone="base" />
                  </Box>
                  <InlineStack gap="100" blockAlign="center">
                    <Icon source={stat.positive ? ArrowUpIcon : ArrowDownIcon} tone={stat.positive ? "success" : "critical"} />
                    <Text as="span" variant="bodySm" tone={stat.positive ? "success" : "critical"} fontWeight="medium">
                      {stat.change}
                    </Text>
                  </InlineStack>
                </InlineStack>
                <BlockStack gap="100">
                  <Text as="p" variant="headingXl" fontWeight="semibold">
                    {stat.value}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {stat.title}
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, lg: "2fr 1fr" }} gap="400">
          {/* Main content */}
          <BlockStack gap="400">
            {/* Ordini recenti */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Ordini recenti</Text>
                  <Button variant="plain" url="/ordini">Vedi tutti</Button>
                </InlineStack>

                <div style={{ border: "1px solid #e1e3e5", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f6f6f7" }}>
                        <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Ordine</th>
                        <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Cliente</th>
                        <th style={{ padding: "10px 16px", textAlign: "right", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Importo</th>
                        <th style={{ padding: "10px 16px", textAlign: "center", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} style={{ borderTop: "1px solid #e1e3e5" }}>
                          <td style={{ padding: "12px 16px" }}>
                            <BlockStack gap="050">
                              <Text as="span" variant="bodyMd" fontWeight="semibold">{order.id}</Text>
                              <Text as="span" variant="bodySm" tone="subdued">{order.time}</Text>
                            </BlockStack>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <Text as="span" variant="bodyMd">{order.customer}</Text>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <Text as="span" variant="bodyMd" fontWeight="semibold">{euro}{order.amount}</Text>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <Badge tone={order.status === "Evaso" ? "success" : "attention"}>{order.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BlockStack>
            </Card>

            {/* Prodotti piu venduti */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Prodotti piu venduti</Text>
                  <Button variant="plain" url="/prodotti">Vedi tutti</Button>
                </InlineStack>
                <Divider />
                {data?.topProducts && data.topProducts.length > 0 ? (
                  <BlockStack gap="300">
                    {data.topProducts.slice(0, 5).map((product: any, index: number) => (
                      <InlineStack key={index} align="space-between" blockAlign="center">
                        <InlineStack gap="300" blockAlign="center">
                          <div style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#f6f6f7",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            color: "#637381",
                          }}>
                            {index + 1}
                          </div>
                          <Text as="span" variant="bodyMd">{product.title || product.nome}</Text>
                        </InlineStack>
                        <Badge tone="success">{product.vendite || 0} vendite</Badge>
                      </InlineStack>
                    ))}
                  </BlockStack>
                ) : (
                  <Text as="p" tone="subdued">Nessun prodotto venduto ancora</Text>
                )}
              </BlockStack>
            </Card>
          </BlockStack>

          {/* Sidebar */}
          <BlockStack gap="400">
            {/* Azioni rapide */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Azioni rapide</Text>
                <InlineGrid columns={2} gap="200">
                  {quickActions.map((action, index) => (
                    <Button key={index} url={action.url} icon={action.icon} fullWidth>
                      {action.label}
                    </Button>
                  ))}
                </InlineGrid>
              </BlockStack>
            </Card>

            {/* Setup progress */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Configura il negozio</Text>
                  <Badge>{completedTasks}/{setupTasks.length}</Badge>
                </InlineStack>
                <ProgressBar progress={progressPercent} tone="primary" size="small" />
                <BlockStack gap="200">
                  {setupTasks.map((task, index) => (
                    <InlineStack key={index} gap="200" blockAlign="center">
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: task.completed ? "#008060" : "#e1e3e5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                      }}>
                        {task.completed ? "\u2713" : ""}
                      </div>
                      <Text as="span" variant="bodySm" tone={task.completed ? "subdued" : "base"}>
                        {task.label}
                      </Text>
                    </InlineStack>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Statistiche veloci */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Questo mese</Text>
                <Divider />
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Visite negozio</Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">1,247</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Conversione</Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">3.2%</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Valore medio ordine</Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">{euro}56,00</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Clienti nuovi</Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">23</Text>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    </Page>
  )
}
