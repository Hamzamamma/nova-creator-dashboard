"use client"

import { useState } from "react"
import {
  Tag,
  Plus,
  Search,
  MoreHorizontal,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Calendar,
  Copy,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for discounts
const initialDiscounts = [
  {
    id: 1,
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "Sconto di benvenuto",
    usageCount: 45,
    usageLimit: 100,
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    minPurchase: 50,
  },
  {
    id: 2,
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    description: "Saldi estivi",
    usageCount: 120,
    usageLimit: null,
    status: "active",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    minPurchase: null,
  },
  {
    id: 3,
    code: "FREESHIPIT",
    type: "shipping",
    value: 0,
    description: "Spedizione gratuita Italia",
    usageCount: 89,
    usageLimit: null,
    status: "active",
    startDate: "2025-01-01",
    endDate: null,
    minPurchase: 30,
  },
  {
    id: 4,
    code: "BLACKFRIDAY",
    type: "fixed",
    value: 15,
    description: "Black Friday",
    usageCount: 500,
    usageLimit: 500,
    status: "expired",
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    minPurchase: null,
  },
]

const discountTypes = [
  { value: "percentage", label: "Percentuale", icon: Percent },
  { value: "fixed", label: "Importo fisso", icon: DollarSign },
  { value: "shipping", label: "Spedizione gratuita", icon: Truck },
  { value: "buyXgetY", label: "Compra X ottieni Y", icon: Gift },
]

export default function ScontiPage() {
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    usageLimit: "",
    minPurchase: "",
    startDate: "",
    endDate: "",
  })

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateDiscount = () => {
    const discount = {
      id: discounts.length + 1,
      code: newDiscount.code.toUpperCase(),
      type: newDiscount.type,
      value: parseFloat(newDiscount.value) || 0,
      description: newDiscount.description,
      usageCount: 0,
      usageLimit: newDiscount.usageLimit ? parseInt(newDiscount.usageLimit) : null,
      status: "active" as const,
      startDate: newDiscount.startDate || new Date().toISOString().split("T")[0],
      endDate: newDiscount.endDate || null,
      minPurchase: newDiscount.minPurchase ? parseFloat(newDiscount.minPurchase) : null,
    }
    setDiscounts([discount, ...discounts])
    setIsCreateOpen(false)
    setNewDiscount({
      code: "",
      type: "percentage",
      value: "",
      description: "",
      usageLimit: "",
      minPurchase: "",
      startDate: "",
      endDate: "",
    })
  }

  const toggleStatus = (id: number) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "active" ? "inactive" : "active" }
          : d
      )
    )
  }

  const deleteDiscount = (id: number) => {
    setDiscounts(discounts.filter((d) => d.id !== id))
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const getTypeIcon = (type: string) => {
    const typeObj = discountTypes.find((t) => t.value === type)
    return typeObj ? typeObj.icon : Tag
  }

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case "percentage":
        return `${value}%`
      case "fixed":
        return `€${value}`
      case "shipping":
        return "Gratis"
      default:
        return value
    }
  }

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sconti</h1>
            <p className="text-sm text-muted-foreground">
              Gestisci sconti e promozioni
            </p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crea sconto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crea nuovo sconto</DialogTitle>
              <DialogDescription>
                Configura un nuovo codice sconto per i tuoi clienti
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Codice sconto</Label>
                <Input
                  id="code"
                  placeholder="ES: SUMMER25"
                  value={newDiscount.code}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo di sconto</Label>
                <Select
                  value={newDiscount.type}
                  onValueChange={(value) =>
                    setNewDiscount({ ...newDiscount, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {discountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newDiscount.type !== "shipping" && (
                <div className="grid gap-2">
                  <Label htmlFor="value">
                    {newDiscount.type === "percentage" ? "Percentuale (%)" : "Importo (€)"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder={newDiscount.type === "percentage" ? "10" : "15.00"}
                    value={newDiscount.value}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, value: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="description">Descrizione</Label>
                <Input
                  id="description"
                  placeholder="Descrizione breve dello sconto"
                  value={newDiscount.description}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minPurchase">Acquisto minimo (€)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    placeholder="0.00"
                    value={newDiscount.minPurchase}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, minPurchase: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit">Limite utilizzi</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="Illimitato"
                    value={newDiscount.usageLimit}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, usageLimit: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Data inizio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newDiscount.startDate}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Data fine</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newDiscount.endDate}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleCreateDiscount} disabled={!newDiscount.code}>
                Crea sconto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cerca sconti..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtri
        </Button>
      </div>

      {/* Discounts List */}
      {filteredDiscounts.length === 0 && !searchQuery ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 rounded-full bg-muted p-6">
              <Tag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Gestisci sconti e promozioni
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Aggiungi codici sconto e sconti automatici che si applicano al check-out.
              Puoi anche utilizzare gli sconti con prezzi di confronto.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crea sconto
            </Button>
          </CardContent>
        </Card>
      ) : filteredDiscounts.length === 0 ? (
        /* No results */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun risultato</h3>
            <p className="text-muted-foreground">
              Nessuno sconto trovato per "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Discounts Table */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codice</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valore</TableHead>
                <TableHead>Utilizzi</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscounts.map((discount) => {
                const TypeIcon = getTypeIcon(discount.type)
                return (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {discount.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyCode(discount.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {discount.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {discountTypes.find((t) => t.value === discount.type)?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatValue(discount.type, discount.value)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {discount.usageCount}
                        {discount.usageLimit && (
                          <span className="text-muted-foreground">
                            {" "}/ {discount.usageLimit}
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          discount.status === "active"
                            ? "default"
                            : discount.status === "expired"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          discount.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {discount.status === "active"
                          ? "Attivo"
                          : discount.status === "expired"
                          ? "Scaduto"
                          : "Inattivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {discount.endDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(discount.endDate).toLocaleDateString("it-IT")}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nessuna</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyCode(discount.code)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copia codice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(discount.id)}>
                            {discount.status === "active" ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Disattiva
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Attiva
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteDiscount(discount.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Stats Cards */}
      {filteredDiscounts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.filter((d) => d.status === "active").length}
              </div>
              <p className="text-sm text-muted-foreground">Sconti attivi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.reduce((acc, d) => acc + d.usageCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Utilizzi totali</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.filter((d) => d.type === "percentage").length > 0
                  ? `${Math.round(
                      discounts
                        .filter((d) => d.type === "percentage")
                        .reduce((acc, d) => acc + d.value, 0) /
                        discounts.filter((d) => d.type === "percentage").length
                    )}%`
                  : "0%"}
              </div>
              <p className="text-sm text-muted-foreground">Sconto medio</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
