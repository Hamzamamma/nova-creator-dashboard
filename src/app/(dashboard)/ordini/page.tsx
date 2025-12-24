"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ShoppingCart,
  Package,
  RotateCcw,
  CheckCircle,
  Truck,
  Loader2,
  Globe,
} from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"

interface OrdersData {
  currency: string
  stats: {
    totalOrders: number
    totalItems: number
    refundedOrders: number
    fulfilledOrders: number
    deliveredOrders: number
    refundRate: string
    fulfillmentRate: string
  }
  chartData: { giorno: string; ordini: number }[]
  topProdotti: { nome: string; vendite: number }[]
  ordiniRecenti: {
    id: string
    prodotto: string
    cliente: string
    data: string
    stato: string
    totale: string
  }[]
}

const chartConfig = {
  ordini: {
    label: "Ordini",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function getStatoBadge(stato: string) {
  switch (stato) {
    case "consegnato":
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Consegnato</Badge>
    case "spedito":
      return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Spedito</Badge>
    case "in_lavorazione":
      return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">In lavorazione</Badge>
    case "annullato":
      return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Annullato</Badge>
    default:
      return <Badge variant="secondary">{stato}</Badge>
  }
}

export default function OrdiniPage() {
  const [data, setData] = useState<OrdersData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/shopify/orders")
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
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const stats = data?.stats

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Ordini</h1>
          <p className="text-muted-foreground">Monitora gli ordini dei tuoi prodotti</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          <Globe className="me-1 size-3" />
          Dati Shopify
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ordini</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.totalOrders || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Articoli</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.totalItems || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Resi</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.refundedOrders || 0}</span>
              <span className="text-xs text-muted-foreground">{stats?.refundRate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Evasi</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.fulfilledOrders || 0}</span>
              <span className="text-xs text-green-500">{stats?.fulfillmentRate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Consegnati</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.deliveredOrders || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafico Ordini */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Andamento Ordini</CardTitle>
            <CardDescription>Ordini ricevuti negli ultimi 7 giorni</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="giorno" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="ordini"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Prodotti */}
        <Card>
          <CardHeader>
            <CardTitle>Prodotti piu venduti</CardTitle>
            <CardDescription>In base agli ordini</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.topProdotti && data.topProdotti.length > 0 ? (
              <div className="space-y-4">
                {data.topProdotti.map((prodotto, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[140px]">{prodotto.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{prodotto.vendite}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Nessun prodotto venduto</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabella Ordini Recenti */}
      <Card>
        <CardHeader>
          <CardTitle>Ordini Recenti</CardTitle>
          <CardDescription>Gli ultimi ordini ricevuti per i tuoi prodotti</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.ordiniRecenti && data.ordiniRecenti.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordine</TableHead>
                  <TableHead>Prodotto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.ordiniRecenti.map((ordine) => (
                  <TableRow key={ordine.id}>
                    <TableCell className="font-medium">{ordine.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{ordine.prodotto}</TableCell>
                    <TableCell>{ordine.cliente}</TableCell>
                    <TableCell>{ordine.data}</TableCell>
                    <TableCell>{getStatoBadge(ordine.stato)}</TableCell>
                    <TableCell className="text-right font-medium">{ordine.totale}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nessun ordine ancora</p>
              <p className="text-sm text-muted-foreground mt-1">Gli ordini appariranno qui quando riceverai il primo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
