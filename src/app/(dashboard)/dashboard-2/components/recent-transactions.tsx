"use client"

import { Eye, MoreHorizontal, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Transaction {
  id: string
  customer: {
    name: string
    email: string
    initials: string
  }
  amount: string
  status: string
  date: string
}

interface Props {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ordini Recenti</CardTitle>
          <CardDescription>Ultime transazioni</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nessun ordine ancora</p>
          <p className="text-sm text-muted-foreground mt-1">Gli ordini appariranno qui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Ordini Recenti</CardTitle>
          <CardDescription>Ultime transazioni dei clienti</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          Vedi Tutti
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            <div className="flex p-3 rounded-lg border gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{transaction.customer.initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{transaction.customer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{transaction.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      transaction.status === "completed" ? "default" :
                      transaction.status === "pending" ? "secondary" : "destructive"
                    }
                    className="cursor-pointer"
                  >
                    {transaction.status === "completed" ? "Completato" :
                     transaction.status === "pending" ? "In attesa" : "Annullato"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{transaction.amount}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
