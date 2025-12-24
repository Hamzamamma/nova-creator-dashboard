"use client"

import { Eye, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  sales: number
  revenue: string
}

interface Props {
  products: Product[]
  currency: string
}

export function TopProducts({ products, currency }: Props) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prodotti Migliori</CardTitle>
          <CardDescription>I piu venduti questo mese</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nessun prodotto ancora</p>
          <p className="text-sm text-muted-foreground mt-1">I prodotti appariranno qui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Prodotti Migliori</CardTitle>
          <CardDescription>I piu venduti questo mese</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          Vedi Tutti
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center p-3 rounded-lg border gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              #{index + 1}
            </div>
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div>
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} vendite</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{product.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
