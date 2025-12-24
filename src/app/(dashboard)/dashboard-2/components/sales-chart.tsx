"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface Props {
  data: { day: string; sales: number }[]
  currency: string
}

const chartConfig = {
  sales: {
    label: "Vendite",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SalesChart({ data, currency }: Props) {
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendite Ultimi 7 Giorni</CardTitle>
        <CardDescription>Totale: {currency} {totalSales.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `${currency}${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
