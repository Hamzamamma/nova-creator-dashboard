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
      icon: DollarSign,
      footer: "Entrate totali",
      subfooter: "Da tutti gli ordini"
    },
    {
      title: "Clienti",
      value: m?.totalCustomers?.toString() || "0",
      icon: Users,
      footer: "Clienti registrati",
      subfooter: "Nel tuo database"
    },
    {
      title: "Ordini Totali",
      value: m?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      footer: `${m?.fulfilledOrders || 0} evasi`,
      subfooter: "Ordini processati"
    },
    {
      title: "Prodotti",
      value: m?.totalProducts?.toString() || "0",
      icon: Package,
      footer: "Nel catalogo",
      subfooter: "Prodotti attivi"
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="cursor-pointer">
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
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
