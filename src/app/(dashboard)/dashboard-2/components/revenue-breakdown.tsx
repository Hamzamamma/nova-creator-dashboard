"use client"

import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label, Pie, PieChart } from "recharts"

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

const chartConfig = {
  revenue: {
    label: "Fatturato",
  },
  orders: {
    label: "Ordini",
    color: "hsl(var(--chart-1))",
  },
  fulfilled: {
    label: "Evasi",
    color: "hsl(var(--chart-2))",
  },
  customers: {
    label: "Clienti",
    color: "hsl(var(--chart-3))",
  },
  pending: {
    label: "In Attesa",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function RevenueBreakdown({ data }: Props) {
  const currency = data?.shop?.currency || "EUR"
  const m = data?.metrics

  const ordersTotal = m?.totalOrders || 0
  const fulfilledOrders = m?.fulfilledOrders || 0
  const pendingOrders = ordersTotal - fulfilledOrders

  const chartData = [
    { category: "fulfilled", value: fulfilledOrders, fill: "hsl(var(--chart-2))" },
    { category: "pending", value: pendingOrders > 0 ? pendingOrders : 0, fill: "hsl(var(--chart-4))" },
  ]

  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Ripartizione Ordini</CardTitle>
        <CardDescription>Stato degli ordini</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Ordini Totali
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {fulfilledOrders > 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
              {((fulfilledOrders / (ordersTotal || 1)) * 100).toFixed(0)}% ordini evasi
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              Nessun ordine evaso ancora
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {currency} {m?.totalRevenue || "0"} di fatturato totale
        </div>
      </CardFooter>
    </Card>
  )
}
