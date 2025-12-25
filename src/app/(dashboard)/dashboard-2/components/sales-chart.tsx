"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp } from "lucide-react"

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
  const [period, setPeriod] = useState("7days")
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0)
  const avgSales = data.length > 0 ? totalSales / data.length : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance Vendite</CardTitle>
            <CardDescription>
              Totale: {currency} {totalSales.toFixed(2)} | Media: {currency} {avgSales.toFixed(2)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Ultimi 7 giorni</SelectItem>
                <SelectItem value="30days">Ultimi 30 giorni</SelectItem>
                <SelectItem value="3months">Ultimi 3 mesi</SelectItem>
                <SelectItem value="year">Quest'anno</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Esporta
            </Button>
          </div>
        </div>
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
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>Vendite in crescita del 5.2% rispetto al periodo precedente</span>
        </div>
      </CardContent>
    </Card>
  )
}
