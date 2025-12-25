"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, UserPlus, UserCheck, Crown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

interface Props {
  customers: number
}

const chartData = [
  { month: "Gen", nuovi: 12, attivi: 8 },
  { month: "Feb", nuovi: 19, attivi: 14 },
  { month: "Mar", nuovi: 23, attivi: 18 },
  { month: "Apr", nuovi: 15, attivi: 12 },
  { month: "Mag", nuovi: 28, attivi: 22 },
  { month: "Giu", nuovi: 32, attivi: 26 },
]

const chartConfig = {
  nuovi: {
    label: "Nuovi Clienti",
    color: "hsl(var(--chart-1))",
  },
  attivi: {
    label: "Clienti Attivi",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function CustomerInsights({ customers }: Props) {
  const stats = [
    {
      label: "Totali",
      value: customers,
      icon: Users,
      color: "text-primary"
    },
    {
      label: "Nuovi",
      value: Math.floor(customers * 0.15),
      icon: UserPlus,
      color: "text-green-500"
    },
    {
      label: "Attivi",
      value: Math.floor(customers * 0.6),
      icon: UserCheck,
      color: "text-blue-500"
    },
    {
      label: "VIP",
      value: Math.floor(customers * 0.05),
      icon: Crown,
      color: "text-yellow-500"
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insight Clienti</CardTitle>
        <CardDescription>
          Analisi dettagliata della base clienti degli ultimi 6 mesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <div className={"p-2 rounded-lg bg-background " + stat.color}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="attivi"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.2}
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="nuovi"
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.2}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Crescita del 5.2% questo mese
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Retention rate eccellente: 78%
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
