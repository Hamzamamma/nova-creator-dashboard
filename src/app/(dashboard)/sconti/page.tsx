"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tag, Percent, Gift, ShoppingCart, Truck, Plus, Search, MoreVertical, Copy, Pencil, Trash2, Eye, Loader2, RefreshCw, Globe } from "lucide-react"

interface Sconto {
  id: string
  codice: string
  tipo: string
  tipoLabel: string
  valore: string
  stato: string
  utilizzi: number
  utilizziMax: number | null
  dataInizio: string | null
  dataFine: string | null
  shopifyId?: number
}

const tipiSconto = [
  { id: "nuovo", titolo: "Sconto sui prodotti", desc: "Sconto percentuale o fisso su prodotti", icon: Percent, color: "bg-blue-500/10 text-blue-500" },
  { id: "buy-x-get-y", titolo: "Buy X get Y", desc: "Acquista X prodotti, ottieni Y gratis", icon: Gift, color: "bg-purple-500/10 text-purple-500" },
  { id: "ordine", titolo: "Sconto ordine", desc: "Sconto sul totale ordine", icon: ShoppingCart, color: "bg-green-500/10 text-green-500" },
  { id: "spedizione", titolo: "Spedizione gratuita", desc: "Spedizione gratis", icon: Truck, color: "bg-orange-500/10 text-orange-500" },
]

function getStatoBadge(stato: string) {
  switch (stato) {
    case "attivo": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Attivo</Badge>
    case "programmato": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Programmato</Badge>
    case "scaduto": return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">Scaduto</Badge>
    default: return <Badge variant="secondary">{stato}</Badge>
  }
}

function getTipoIcon(tipo: string) {
  switch (tipo) {
    case "prodotti": return <Percent className="h-4 w-4 text-blue-500" />
    case "buy-x-get-y": return <Gift className="h-4 w-4 text-purple-500" />
    case "ordine": return <ShoppingCart className="h-4 w-4 text-green-500" />
    case "spedizione": return <Truck className="h-4 w-4 text-orange-500" />
    default: return <Tag className="h-4 w-4" />
  }
}

export default function ScontiPage() {
  const router = useRouter()
  const [sconti, setSconti] = useState<Sconto[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchSconti = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/shopify/discounts")
      const data = await res.json()
      if (data.success) {
        setSconti(data.sconti)
      }
    } catch (error) {
      console.error("Errore caricamento sconti:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSconti()
  }, [])

  const scontiFiltrati = sconti.filter((s) => s.codice.toLowerCase().includes(searchQuery.toLowerCase()))
  const scontiAttivi = sconti.filter((s) => s.stato === "attivo").length
  const scontiProgrammati = sconti.filter((s) => s.stato === "programmato").length
  const utilizziTotali = sconti.reduce((acc, s) => acc + s.utilizzi, 0)

  const handleCopy = (codice: string) => {
    navigator.clipboard.writeText(codice)
  }

  const handleDelete = async (sconto: Sconto) => {
    if (!sconto.shopifyId) return
    setDeleting(sconto.id)
    try {
      const res = await fetch(`/api/shopify/discounts?id=${sconto.shopifyId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setSconti(sconti.filter((s) => s.id !== sconto.id))
      }
    } catch (error) {
      console.error("Errore eliminazione:", error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Sconti</h1>
          <p className="text-muted-foreground">Gestisci codici sconto e promozioni</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <Globe className="mr-1 h-3 w-3" />
            Shopify
          </Badge>
          <Button variant="outline" size="icon" onClick={fetchSconti} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crea sconto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Totali</span>
            </div>
            <span className="text-2xl font-bold">{sconti.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Attivi</span>
            </div>
            <span className="text-2xl font-bold text-green-500">{scontiAttivi}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Programmati</span>
            </div>
            <span className="text-2xl font-bold text-yellow-500">{scontiProgrammati}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Utilizzi</span>
            </div>
            <span className="text-2xl font-bold">{utilizziTotali}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tutti gli sconti</CardTitle>
              <CardDescription>Sincronizzati con Shopify in tempo reale</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cerca codice..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : scontiFiltrati.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codice</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valore</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Utilizzi</TableHead>
                  <TableHead>Validita</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scontiFiltrati.map((sconto) => (
                  <TableRow key={sconto.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{sconto.codice}</code>
                        <button onClick={() => handleCopy(sconto.codice)} className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(sconto.tipo)}
                        <span className="text-sm text-muted-foreground">{sconto.tipoLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sconto.valore}</TableCell>
                    <TableCell>{getStatoBadge(sconto.stato)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sconto.utilizzi}{sconto.utilizziMax && <span>/{sconto.utilizziMax}</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {sconto.dataInizio || "Sempre"}{sconto.dataFine ? ` - ${sconto.dataFine}` : " - Illimitato"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Visualizza</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(sconto.codice)}><Copy className="h-4 w-4 mr-2" />Copia codice</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Modifica</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(sconto)} disabled={deleting === sconto.id}>
                            {deleting === sconto.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nessuno sconto trovato</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Prova con una ricerca diversa" : "Crea il tuo primo codice sconto su Shopify"}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />Crea sconto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Seleziona tipo di sconto</DialogTitle>
            <DialogDescription>Lo sconto verra creato su Shopify e applicato automaticamente al tuo sito</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {tipiSconto.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => {
                  setModalOpen(false)
                  router.push(`/sconti/${tipo.id}`)
                }}
                className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tipo.color}`}>
                  <tipo.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{tipo.titolo}</div>
                  <div className="text-sm text-muted-foreground">{tipo.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
