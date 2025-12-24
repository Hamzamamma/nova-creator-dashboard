"use client"

import {
  Shield,
  ChevronRight,
  FileText,
  CreditCard,
  Euro,
  Info,
  Receipt,
  Wallet
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FinanzePage() {
  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Finanze</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Documenti
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Fatture</DropdownMenuItem>
            <DropdownMenuItem>Ricevute</DropdownMenuItem>
            <DropdownMenuItem>Report fiscali</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Alert Banner Sicurezza */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">Aggiungi un ulteriore livello di sicurezza</h3>
            <p className="text-sm text-muted-foreground">
              Attiva l'autenticazione in due passaggi per usare il tuo account.{" "}
              <a href="#" className="text-primary hover:underline">Scopri di più</a>
            </p>
            <Button size="sm" className="mt-2">
              <Shield className="mr-2 h-4 w-4" />
              Configura l'autenticazione in due passaggi
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2">
              <div className="h-16 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="h-16 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid principale */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Imposte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imposte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Configura la riscossione delle imposte</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <span className="font-medium block">Dichiarazione dei redditi automatica</span>
                  <Badge variant="secondary" className="mt-1">Inattiva</Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Card Saldo Accrediti */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saldo degli accrediti</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">0,00 €</p>
                <a href="#" className="text-sm text-primary hover:underline">
                  Visualizza accrediti
                </a>
              </div>
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Euro className="h-4 w-4" />
                <span className="font-medium">EUR</span>
                <span className="text-muted-foreground">0,00 €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State - Attiva Payments */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <div className="relative">
              <CreditCard className="h-12 w-12 text-primary" />
              <div className="absolute -right-2 -top-2 rounded-full bg-green-500 p-1">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Gestisci le tue finanze su Shopify</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Configura Shopify Payments per ricevere i pagamenti più velocemente
            e offrire una migliore esperienza di check-out.
          </p>
          <Button size="lg">
            Attiva Shopify Payments
          </Button>
          <a href="#" className="mt-4 text-sm text-muted-foreground hover:text-primary">
            Scopri di più su Shopify Finance
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
