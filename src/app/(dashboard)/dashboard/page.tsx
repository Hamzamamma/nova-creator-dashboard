"use client"

import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { SectionCards } from "./components/section-cards"
import { TopProducts } from "./components/top-products"
import { Loader2 } from "lucide-react"

interface HomeData {
  metrics: {
    totalRevenue: string
    totalOrders: number
    totalProducts: number
    fulfilledOrders: number
  }
  salesChartData: { day: string; sales: number }[]
  topProducts: any[]
  recentTransactions: any[]
}

export default function Page() {
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
      <div className="flex-1 flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Panoramica delle tue vendite</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <SectionCards metrics={data?.metrics} />
        <ChartAreaInteractive chartData={data?.salesChartData} />
        <TopProducts products={data?.topProducts} />
      </div>
    </>
  )
}
