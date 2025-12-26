"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Icon,
  Spinner,
  InlineGrid,
  Divider,
  DataTable,
  EmptyState,
  TextField,
  Modal,
} from "@shopify/polaris"
import {
  DiscountIcon,
  DiscountCodeIcon,
  GiftCardIcon,
  OrderIcon,
  DeliveryIcon,
  SearchIcon,
  PlusIcon,
} from "@shopify/polaris-icons"

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

export default function ScontiPage() {
  const router = useRouter()
  const [sconti, setSconti] = useState<Sconto[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchSconti = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchSconti()
  }, [fetchSconti])

  const scontiFiltrati = sconti.filter((s) => s.codice.toLowerCase().includes(searchQuery.toLowerCase()))
  const scontiAttivi = sconti.filter((s) => s.stato === "attivo").length
  const scontiProgrammati = sconti.filter((s) => s.stato === "programmato").length
  const utilizziTotali = sconti.reduce((acc, s) => acc + s.utilizzi, 0)

  const tipiSconto = [
    { id: "nuovo", titolo: "Sconto sui prodotti", desc: "Sconto percentuale o fisso su prodotti", icon: DiscountCodeIcon },
    { id: "buy-x-get-y", titolo: "Buy X get Y", desc: "Acquista X prodotti, ottieni Y gratis", icon: GiftCardIcon },
    { id: "ordine", titolo: "Sconto ordine", desc: "Sconto sul totale ordine", icon: OrderIcon },
    { id: "spedizione", titolo: "Spedizione gratuita", desc: "Spedizione gratis", icon: DeliveryIcon },
  ]

  const statsCards = [
    { title: "Totali", value: sconti.length, icon: DiscountIcon },
    { title: "Attivi", value: scontiAttivi, icon: DiscountCodeIcon },
    { title: "Programmati", value: scontiProgrammati, icon: GiftCardIcon },
    { title: "Utilizzi", value: utilizziTotali, icon: OrderIcon },
  ]

  const tableRows = scontiFiltrati.map((sconto) => [
    sconto.codice,
    sconto.tipoLabel,
    sconto.valore,
    sconto.stato,
    sconto.utilizzi + (sconto.utilizziMax ? "/" + sconto.utilizziMax : ""),
    (sconto.dataInizio || "Sempre") + (sconto.dataFine ? " - " + sconto.dataFine : " - Illimitato"),
  ])

  if (loading) {
    return (
      <Page title="Sconti">
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    )
  }

  return (
    <Page
      title="Sconti"
      subtitle="Gestisci codici sconto e promozioni"
      primaryAction={{ content: "Crea sconto", icon: PlusIcon, onAction: () => setModalOpen(true) }}
      secondaryActions={[{ content: "Aggiorna", onAction: fetchSconti }]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 2, md: 4 }} gap="400">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={stat.icon} tone="base" />
                    <Text as="span" variant="bodySm" tone="subdued">{stat.title}</Text>
                  </InlineStack>
                  <Badge tone="info">Live</Badge>
                </InlineStack>
                <Text as="p" variant="headingXl" fontWeight="semibold">{stat.value}</Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">Tutti gli sconti</Text>
              <div style={{ width: "300px" }}>
                <TextField
                  label=""
                  labelHidden
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Cerca codice..."
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                />
              </div>
            </InlineStack>
            <Divider />
            {scontiFiltrati.length > 0 ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["Codice", "Tipo", "Valore", "Stato", "Utilizzi", "Validita"]}
                rows={tableRows}
              />
            ) : (
              <EmptyState
                heading="Nessuno sconto trovato"
                action={{ content: "Crea sconto", onAction: () => setModalOpen(true) }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>{searchQuery ? "Prova con una ricerca diversa" : "Crea il tuo primo codice sconto"}</p>
              </EmptyState>
            )}
          </BlockStack>
        </Card>
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Seleziona tipo di sconto"
      >
        <Modal.Section>
          <BlockStack gap="400">
            {tipiSconto.map((tipo) => (
              <div
                key={tipo.id}
                onClick={() => {
                  setModalOpen(false)
                  router.push("/sconti/" + tipo.id)
                }}
                style={{
                  padding: "16px",
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <InlineStack gap="400" blockAlign="center">
                  <Icon source={tipo.icon} tone="base" />
                  <BlockStack gap="100">
                    <Text as="span" variant="bodyMd" fontWeight="semibold">{tipo.titolo}</Text>
                    <Text as="span" variant="bodySm" tone="subdued">{tipo.desc}</Text>
                  </BlockStack>
                </InlineStack>
              </div>
            ))}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
