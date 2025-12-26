"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChartProps {
  chartData?: { day: string; sales: number }[]
}

export function ChartAreaInteractive({ chartData }: ChartProps) {
  const data = chartData || [
    { day: "Lun", sales: 0 },
    { day: "Mar", sales: 0 },
    { day: "Mer", sales: 0 },
    { day: "Gio", sales: 0 },
    { day: "Ven", sales: 0 },
    { day: "Sab", sales: 0 },
    { day: "Dom", sales: 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendite ultimi 7 giorni</CardTitle>
        <CardDescription>Andamento delle vendite in euro</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => "€" + v} />
              <Tooltip formatter={(value) => ["€" + value, "Vendite"]} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
