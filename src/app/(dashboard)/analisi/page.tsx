"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  FileText,
  Loader2
} from "lucide-react"

interface ShopifyAnalytics {
  shop: {
    name: string
    currency: string
    domain: string
  }
  metrics: {
    totalRevenue: string
    ordersCount: number
    productsCount: number
    fulfilledOrders: number
    uniqueCustomers: number
    avgOrderValue: string
    totalDiscounts: string
    totalRefunds: string
  }
  ordersChartData: { giorno: string; ordini: number }[]
  recentOrders: any[]
}

const chartConfig = {
  ordini: {
    label: "Ordini",
    color: "var(--primary)",
  },
}

const sessionsConfig = {
  today: {
    label: "Oggi",
    color: "var(--chart-2)",
  },
}

const deviceData = [
  { device: "Desktop", sessions: 156, percentage: 63, icon: Monitor },
  { device: "Mobile", sessions: 78, percentage: 31, icon: Smartphone },
  { device: "Tablet", sessions: 14, percentage: 6, icon: Tablet },
]

const landingPages = [
  { page: "Homepage", path: "/", sessions: 124, percentage: 50 },
  { page: "Prodotti", path: "/products", sessions: 68, percentage: 27 },
  { page: "Collezioni", path: "/collections", sessions: 32, percentage: 13 },
  { page: "Chi siamo", path: "/about", sessions: 24, percentage: 10 },
]

export default function AnalisiPage() {
  const [data, setData] = useState<ShopifyAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/shopify/analytics")
        const json = await res.json()
        if (json.success) {
          setData(json)
          setLastUpdate(new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }))
        } else {
          setError(json.error || "Errore nel caricamento")
        }
      } catch (err) {
        setError("Impossibile connettersi al server")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">
            Riprova
          </button>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: "Fatturato totale",
      current: `€${data?.metrics.totalRevenue || "0"}`,
      icon: DollarSign,
    },
    {
      title: "Clienti unici",
      current: data?.metrics.uniqueCustomers?.toString() || "0",
      icon: Users,
    },
    {
      title: "Ordini evasi",
      current: data?.metrics.fulfilledOrders?.toString() || "0",
      icon: Package,
    },
    {
      title: "Ordini totali",
      current: data?.metrics.ordersCount?.toString() || "0",
      icon: ShoppingCart,
    },
  ]

  const salesBreakdown = [
    { label: "Fatturato lordo", value: `€${data?.metrics.totalRevenue || "0"}` },
    { label: "Sconti", value: `-€${data?.metrics.totalDiscounts || "0"}` },
    { label: "Resi", value: `-€${data?.metrics.totalRefunds || "0"}` },
    {
      label: "Fatturato netto",
      value: `€${(parseFloat(data?.metrics.totalRevenue || "0") - parseFloat(data?.metrics.totalDiscounts || "0") - parseFloat(data?.metrics.totalRefunds || "0")).toFixed(2)}`,
      highlight: true
    },
  ]

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analisi</h1>
          <p className="text-sm text-muted-foreground">
            {data?.shop.name} • Ultimo aggiornamento: {lastUpdate}
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          <Globe className="me-1 size-3" />
          Connesso a Shopify
        </Badge>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border h-[74px]">
            <CardContent className="flex items-center justify-between h-full py-3 px-4">
              <div className="flex items-center gap-3">
                <metric.icon className="text-muted-foreground size-5" />
                <div>
                  <p className="text-muted-foreground text-xs">{metric.title}</p>
                  <p className="text-lg font-bold">{metric.current}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ordini ultimi 7 giorni + Suddivisione */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grafico Ordini */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ordini ultimi 7 giorni</CardTitle>
            <CardDescription>Dati reali da Shopify</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={data?.ordersChartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                <XAxis dataKey="giorno" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="ordini"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Suddivisione delle vendite */}
        <Card>
          <CardHeader>
            <CardTitle>Suddivisione vendite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {salesBreakdown.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-2 ${
                  item.highlight ? "border-t pt-4 font-semibold" : ""
                }`}
              >
                <span className={item.highlight ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
                <span className={item.highlight ? "text-foreground" : ""}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stats aggiuntivi */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Valore medio ordini */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Valore medio ordini</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              €{data?.metrics.avgOrderValue || "0"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calcolato su {data?.metrics.ordersCount || 0} ordini
            </p>
          </CardContent>
        </Card>

        {/* Prodotti */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Prodotti in catalogo</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {data?.metrics.productsCount || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Prodotti attivi nel tuo store
            </p>
          </CardContent>
        </Card>

        {/* Tasso evasione */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tasso di evasione</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {data?.metrics.ordersCount && data.metrics.ordersCount > 0
                ? `${((data.metrics.fulfilledOrders / data.metrics.ordersCount) * 100).toFixed(0)}%`
                : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {data?.metrics.fulfilledOrders || 0} su {data?.metrics.ordersCount || 0} ordini evasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessioni per dispositivo + Landing pages */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sessioni per dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessioni per dispositivo</CardTitle>
            <CardDescription>Dati simulati (richiede Shopify Analytics API)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.device}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{item.sessions}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sessioni per landing page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessioni per landing page</CardTitle>
            <CardDescription>Dati simulati (richiede Shopify Analytics API)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {landingPages.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">{item.page}</span>
                      <span className="text-xs text-muted-foreground ml-2">{item.path}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{item.sessions}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
