"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Props {
  customers: number
}

export function CustomerInsights({ customers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insight Clienti</CardTitle>
        <CardDescription>Panoramica della tua base clienti</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 p-4 rounded-lg border">
          <div className="p-3 rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold">{customers}</p>
            <p className="text-muted-foreground">Clienti totali registrati</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
