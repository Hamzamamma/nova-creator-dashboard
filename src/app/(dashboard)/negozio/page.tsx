"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Pencil, RefreshCw } from "lucide-react"

export default function NegozioOnlinePage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const siteUrl = "http://localhost:8080"

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Negozio online</h1>
          <p className="text-muted-foreground">Anteprima del tuo sito web</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setRefreshKey(k => k + 1)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri sito
            </a>
          </Button>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Modifica tema
          </Button>
        </div>
      </div>

      {/* Preview Container - Desktop e Mobile affiancati */}
      <div className="flex gap-6 items-start">

        {/* Desktop Preview */}
        <div className="w-[640px]">
          <p className="text-sm font-medium text-muted-foreground mb-3">Desktop</p>
          <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
            {/* Browser Chrome */}
            <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 border">
                  con-mollica-o-senza.com
                </div>
              </div>
            </div>
            {/* Iframe Desktop */}
            <div className="h-[400px] overflow-hidden">
              <iframe
                key={`desktop-${refreshKey}`}
                src={siteUrl}
                className="border-0"
                title="Anteprima desktop"
                style={{
                  width: '1280px',
                  height: '800px',
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="shrink-0">
          <p className="text-sm font-medium text-muted-foreground mb-3">Mobile</p>
          <div className="w-[220px] border-[8px] border-gray-800 rounded-[2rem] overflow-hidden bg-white shadow-2xl">
            {/* Phone Notch */}
            <div className="bg-gray-800 h-5 flex items-center justify-center">
              <div className="w-12 h-3 bg-black rounded-b-lg" />
            </div>
            {/* Iframe Mobile */}
            <div className="h-[400px] overflow-hidden">
              <iframe
                key={`mobile-${refreshKey}`}
                src={siteUrl}
                className="border-0"
                title="Anteprima mobile"
                style={{
                  width: '375px',
                  height: '667px',
                  transform: 'scale(0.58)',
                  transformOrigin: 'top left',
                }}
              />
            </div>
            {/* Home Indicator */}
            <div className="bg-gray-800 h-5 flex items-center justify-center">
              <div className="w-20 h-1 bg-gray-500 rounded-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
