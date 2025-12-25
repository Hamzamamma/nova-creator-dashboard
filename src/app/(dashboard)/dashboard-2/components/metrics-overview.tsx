"use client"

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricsProps {
  data: {
    shop: { currency: string }
    metrics: {
      totalRevenue: string
      totalOrders: number
      totalCustomers: number
      totalProducts: number
      fulfilledOrders: number
      conversionRate: string
    }
  } | null
}

export function MetricsOverview({ data }: MetricsProps) {
  const currency = data?.shop?.currency || "EUR"
  const m = data?.metrics

  const metrics = [
    {
      title: "Fatturato Totale",
      value: m ? `${currency} ${m.totalRevenue}` : "€0",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      footer: "In crescita questo mese",
      subfooter: "Rispetto al periodo precedente"
    },
    {
      title: "Clienti",
      value: m?.totalCustomers?.toString() || "0",
      change: "+5.2%",
      trend: "up" as const,
      icon: Users,
      footer: "Nuovi clienti acquisiti",
      subfooter: "Ottima retention rate"
    },
    {
      title: "Ordini Totali",
      value: m?.totalOrders?.toString() || "0",
      change: "-2.1%",
      trend: "down" as const,
      icon: ShoppingCart,
      footer: `${m?.fulfilledOrders || 0} ordini evasi`,
      subfooter: "Tasso completamento alto"
    },
    {
      title: "Prodotti",
      value: m?.totalProducts?.toString() || "0",
      change: "+8.3%",
      trend: "up" as const,
      icon: Package,
      footer: "Catalogo in espansione",
      subfooter: "Prodotti attivi nel negozio"
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge
                variant={metric.trend === "up" ? "default" : "destructive"}
                className="flex gap-1 rounded-lg text-xs"
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {metric.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.trend === "up" ? (
                <TrendingUp className="size-4 text-green-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
              {metric.footer}
            </div>
            <div className="text-muted-foreground">
              {metric.subfooter}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
