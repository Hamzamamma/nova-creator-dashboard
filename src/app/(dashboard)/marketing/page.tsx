"use client"

import { useState } from "react"
import {
  Megaphone,
  Info,
  X,
  Calendar,
  BarChart3,
  Home,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Target,
  Settings,
  Download,
  FileText,
  Search,
  Share2,
  Mail,
  Instagram,
  Facebook,
  ExternalLink,
  Users,
  ShoppingCart,
  Percent,
  DollarSign,
  ArrowUpRight
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const metrics = [
  {
    title: "Sessioni",
    current: "2,847",
    previous: "2,530",
    growth: 12.5,
    icon: Users,
  },
  {
    title: "Vendite attribuite",
    current: "€4,250",
    previous: "€3,920",
    growth: 8.4,
    icon: DollarSign,
  },
  {
    title: "Ordini attribuiti",
    current: "48",
    previous: "42",
    growth: 14.3,
    icon: ShoppingCart,
  },
  {
    title: "Tasso conversione",
    current: "1.68%",
    previous: "1.72%",
    growth: -2.3,
    icon: Percent,
  },
  {
    title: "VMO attribuito",
    current: "€88.54",
    previous: "€83.20",
    growth: 6.4,
    icon: Target,
  },
]

const channelsData = [
  {
    canale: "Diretto",
    icon: Home,
    tipo: "direct",
    sessioni: 1245,
    entrate: "€2,450",
    ordini: 28,
    conversione: "2.25%",
    roas: "—",
    cpa: "—",
    ctr: "—",
    trend: "up",
  },
  {
    canale: "Ricerca organica",
    icon: Search,
    tipo: "organic",
    sessioni: 892,
    entrate: "€1,120",
    ordini: 12,
    conversione: "1.34%",
    roas: "—",
    cpa: "—",
    ctr: "3.2%",
    trend: "up",
  },
  {
    canale: "Social",
    icon: Share2,
    tipo: "social",
    sessioni: 456,
    entrate: "€580",
    ordini: 6,
    conversione: "1.32%",
    roas: "2.4x",
    cpa: "€12.50",
    ctr: "1.8%",
    trend: "down",
  },
  {
    canale: "Email",
    icon: Mail,
    tipo: "email",
    sessioni: 254,
    entrate: "€100",
    ordini: 2,
    conversione: "0.79%",
    roas: "4.2x",
    cpa: "€8.20",
    ctr: "12.5%",
    trend: "up",
  },
]

const sessionData = [
  { day: "Lun", sessioni: 420, conversioni: 8 },
  { day: "Mar", sessioni: 380, conversioni: 6 },
  { day: "Mer", sessioni: 450, conversioni: 10 },
  { day: "Gio", sessioni: 520, conversioni: 12 },
  { day: "Ven", sessioni: 480, conversioni: 9 },
  { day: "Sab", sessioni: 320, conversioni: 5 },
  { day: "Dom", sessioni: 277, conversioni: 4 },
]

const chartConfig = {
  sessioni: {
    label: "Sessioni",
    color: "var(--primary)",
  },
  conversioni: {
    label: "Conversioni",
    color: "var(--chart-2)",
  },
}

export default function MarketingPage() {
  const [showBanner, setShowBanner] = useState(true)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground">
            Monitora le performance delle tue campagne e canali di acquisizione
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Nuova Campagna
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Azioni
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Genera Report
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Esporta Dati
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Impostazioni
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alert Banner */}
      {showBanner && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Shopify Email è ora disponibile</p>
                <p className="text-xs text-muted-foreground">Crea campagne email direttamente dall'app.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="cursor-pointer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Apri Email
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => setShowBanner(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtri */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[160px] cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d" className="cursor-pointer">Ultimi 7 giorni</SelectItem>
              <SelectItem value="30d" className="cursor-pointer">Ultimi 30 giorni</SelectItem>
              <SelectItem value="90d" className="cursor-pointer">Ultimi 90 giorni</SelectItem>
              <SelectItem value="12m" className="cursor-pointer">Ultimi 12 mesi</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="none">
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="cursor-pointer">Nessun confronto</SelectItem>
              <SelectItem value="prev" className="cursor-pointer">Periodo precedente</SelectItem>
              <SelectItem value="year" className="cursor-pointer">Anno precedente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select defaultValue="last-click">
          <SelectTrigger className="w-[220px] cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-click" className="cursor-pointer">Ultimo clic non diretto</SelectItem>
            <SelectItem value="first-click" className="cursor-pointer">Primo clic</SelectItem>
            <SelectItem value="linear" className="cursor-pointer">Lineare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <Card key={index} className="border">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <metric.icon className="text-muted-foreground size-6" />
                <Badge
                  variant="outline"
                  className={
                    metric.growth >= 0
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                  }
                >
                  {metric.growth >= 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      +{metric.growth}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {metric.growth}%
                    </>
                  )}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">{metric.title}</p>
                <div className="text-2xl font-bold">{metric.current}</div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {metric.previous}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Sessioni Chart */}
        <Card className="cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Sessioni nel Tempo</CardTitle>
              <CardDescription>Traffico giornaliero ultimi 7 giorni</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="cursor-pointer">
              Export
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={sessionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessioni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sessioni)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-sessioni)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sessioni"
                  stroke="var(--color-sessioni)"
                  fill="url(#colorSessioni)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Conversioni per Canale */}
        <Card className="cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Conversioni per Canale</CardTitle>
              <CardDescription>Performance per fonte di traffico</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="cursor-pointer">
              Dettagli
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={channelsData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="canale" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ordini" fill="var(--primary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Canali di Marketing Table */}
      <Card className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Canali di Marketing</CardTitle>
            <CardDescription>Analisi dettagliata per canale di acquisizione</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            Report Completo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canale</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Sessioni</TableHead>
                  <TableHead className="text-right">Entrate</TableHead>
                  <TableHead className="text-right">Ordini</TableHead>
                  <TableHead className="text-right">Conv.</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelsData.map((channel) => (
                  <TableRow
                    key={channel.canale}
                    className={`cursor-pointer transition-colors ${activeChannel === channel.canale ? 'bg-muted' : 'hover:bg-muted/50'}`}
                    onClick={() => setActiveChannel(activeChannel === channel.canale ? null : channel.canale)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                          <channel.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p>{channel.canale}</p>
                          {channel.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500 inline" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 inline" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{channel.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{channel.sessioni.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{channel.entrate}</TableCell>
                    <TableCell className="text-right">{channel.ordini}</TableCell>
                    <TableCell className="text-right">{channel.conversione}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{channel.roas}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{channel.cpa}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{channel.ctr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Card Campagne - Empty State migliorato */}
      <Card className="cursor-pointer overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 space-y-4">
              <Badge variant="outline" className="mb-2">Nuovo</Badge>
              <h3 className="text-2xl font-bold">Centralizza il monitoraggio delle campagne</h3>
              <p className="text-muted-foreground">
                Crea campagne per valutare in che modo le iniziative di marketing promuovono gli obiettivi
                aziendali. Acquisisci touchpoint online e offline, aggiungi attività da più canali
                e monitora i risultati in tempo reale.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Crea Prima Campagna
                </Button>
                <Button variant="outline" className="cursor-pointer">
                  Scopri di più
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center animate-pulse">
                  <Target className="h-14 w-14 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-12 w-12 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="absolute -bottom-2 -left-2 h-10 w-10 rounded-lg bg-card border shadow-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
