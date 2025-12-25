"use client"

import { useEffect, useState } from "react"
import { MetricsOverview } from "./components/metrics-overview"
import { SalesChart } from "./components/sales-chart"
import { RecentTransactions } from "./components/recent-transactions"
import { TopProducts } from "./components/top-products"
import { CustomerInsights } from "./components/customer-insights"
import { QuickActions } from "./components/quick-actions"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import { Loader2, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HomeData {
  shop: { name: string; currency: string; domain: string }
  metrics: {
    totalRevenue: string
    totalOrders: number
    totalCustomers: number
    totalProducts: number
    fulfilledOrders: number
    conversionRate: string
  }
  recentTransactions: any[]
  topProducts: any[]
  salesChartData: { day: string; sales: number }[]
}

export default function Dashboard2() {
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Auto-refresh ogni 30 secondi
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Enhanced Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard {data?.shop.name}</h1>
          <p className="text-muted-foreground">
            Monitora le performance del tuo business in tempo reale
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <Globe className="me-1 size-3" />
            Connesso
          </Badge>
          <QuickActions />
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="@container/main space-y-6">
        {/* Top Row - Key Metrics */}
        <MetricsOverview data={data} />

        {/* Second Row - Charts */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <SalesChart data={data?.salesChartData || []} currency={data?.shop.currency || "EUR"} />
          <RevenueBreakdown data={data} />
        </div>

        {/* Third Row */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <RecentTransactions transactions={data?.recentTransactions || []} />
          <TopProducts products={data?.topProducts || []} currency={data?.shop.currency || "EUR"} />
        </div>

        {/* Fourth Row */}
        <CustomerInsights customers={data?.metrics.totalCustomers || 0} />
      </div>
    </div>
  )
}
