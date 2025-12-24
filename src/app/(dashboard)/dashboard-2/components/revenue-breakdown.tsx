"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

interface Props {
  data: {
    shop: { currency: string }
    metrics: {
      totalRevenue: string
      totalOrders: number
      totalCustomers: number
      fulfilledOrders: number
    }
  } | null
}

export function RevenueBreakdown({ data }: Props) {
  const currency = data?.shop?.currency || "EUR"
  const m = data?.metrics

  const items = [
    {
      label: "Fatturato Totale",
      value: `${currency} ${m?.totalRevenue || "0"}`,
      icon: DollarSign,
    },
    {
      label: "Ordini",
      value: m?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
    },
    {
      label: "Ordini Evasi",
      value: m?.fulfilledOrders?.toString() || "0",
      icon: Package,
    },
    {
      label: "Clienti",
      value: m?.totalCustomers?.toString() || "0",
      icon: Users,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riepilogo</CardTitle>
        <CardDescription>Panoramica del business</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
