"use client"

import { useState } from "react"
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  InlineGrid,
  Button,
  Box,
  Badge,
  Divider,
  Icon,
  TextField,
  Modal,
  Banner,
  ProgressBar,
} from "@shopify/polaris"
import {
  BankIcon,
  CashDollarIcon,
  ChartVerticalIcon,
  ClockIcon,
  CheckCircleIcon,
  EditIcon,
  PlusIcon,
  AlertTriangleIcon,
} from "@shopify/polaris-icons"

export default function FinanzePage() {
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const [configurePayoutOpen, setConfigurePayoutOpen] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState<"iban" | "paypal" | null>("iban")
  const [ibanValue, setIbanValue] = useState("IT60 X054 2811 1010 0000 0123 456")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const euro = String.fromCharCode(8364)

  // Saldo del creator
  const balance = {
    total: "1.234,50",
    available: "1.089,00",
    pending: "145,50",
    minWithdraw: "50,00",
  }

  // Storico pagamenti ricevuti
  const payoutHistory = [
    { id: "1", amount: "456,00", date: "15 Dic 2025", method: "IBAN", status: "Completato" },
    { id: "2", amount: "312,50", date: "1 Dic 2025", method: "IBAN", status: "Completato" },
    { id: "3", amount: "189,00", date: "15 Nov 2025", method: "IBAN", status: "Completato" },
    { id: "4", amount: "523,00", date: "1 Nov 2025", method: "PayPal", status: "Completato" },
  ]

  // Ultime vendite
  const recentSales = [
    { id: "1", product: "T-Shirt Logo", amount: "+25,00", date: "Oggi, 14:32" },
    { id: "2", product: "Felpa Premium", amount: "+45,00", date: "Oggi, 10:15" },
    { id: "3", product: "Poster A3", amount: "+15,00", date: "Ieri, 18:45" },
    { id: "4", product: "Tazza Personalizzata", amount: "+12,00", date: "Ieri, 09:00" },
  ]

  const handleRequestPayout = () => {
    // Logica per richiedere prelievo
    setPayoutModalOpen(false)
    setWithdrawAmount("")
  }

  return (
    <Page
      title="Finanze"
      subtitle="Gestisci i tuoi guadagni e metodi di pagamento"
    >
      <BlockStack gap="600">
        {/* Banner se non ha configurato metodo di pagamento */}
        {!payoutMethod && (
          <Banner
            title="Configura il metodo di pagamento"
            tone="warning"
            action={{ content: "Configura ora", onAction: () => setConfigurePayoutOpen(true) }}
          >
            <p>Per ricevere i tuoi guadagni, devi configurare un metodo di pagamento (IBAN o PayPal).</p>
          </Banner>
        )}

        {/* Stats principali */}
        <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="p" variant="bodySm" tone="subdued">Guadagni totali</Text>
                <Icon source={ChartVerticalIcon} tone="base" />
              </InlineStack>
              <Text as="p" variant="headingXl" fontWeight="semibold">{balance.total} {euro}</Text>
              <Text as="p" variant="bodySm" tone="subdued">Da inizio attivita</Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="p" variant="bodySm" tone="subdued">Disponibile per prelievo</Text>
                <Icon source={CashDollarIcon} tone="success" />
              </InlineStack>
              <Text as="p" variant="headingXl" fontWeight="semibold" tone="success">{balance.available} {euro}</Text>
              <Button variant="primary" onClick={() => setPayoutModalOpen(true)}>
                Richiedi prelievo
              </Button>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="p" variant="bodySm" tone="subdued">In elaborazione</Text>
                <Icon source={ClockIcon} tone="warning" />
              </InlineStack>
              <Text as="p" variant="headingXl" fontWeight="semibold">{balance.pending} {euro}</Text>
              <Text as="p" variant="bodySm" tone="subdued">Disponibile tra 3-5 giorni</Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, lg: "2fr 1fr" }} gap="400">
          {/* Colonna sinistra */}
          <BlockStack gap="400">
            {/* Metodo di pagamento configurato */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Metodo di ricezione pagamenti</Text>
                  <Button variant="plain" icon={EditIcon} onClick={() => setConfigurePayoutOpen(true)}>
                    Modifica
                  </Button>
                </InlineStack>

                {payoutMethod === "iban" ? (
                  <div style={{ padding: "16px", backgroundColor: "#f6f6f7", borderRadius: "12px" }}>
                    <InlineStack gap="300" blockAlign="center">
                      <Box background="bg-fill-success" padding="300" borderRadius="full">
                        <Icon source={BankIcon} tone="text-inverse" />
                      </Box>
                      <BlockStack gap="100">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="p" variant="headingSm">Bonifico Bancario (IBAN)</Text>
                          <Badge tone="success">Attivo</Badge>
                        </InlineStack>
                        <Text as="p" variant="bodySm" tone="subdued">{ibanValue}</Text>
                      </BlockStack>
                    </InlineStack>
                  </div>
                ) : payoutMethod === "paypal" ? (
                  <div style={{ padding: "16px", backgroundColor: "#f6f6f7", borderRadius: "12px" }}>
                    <InlineStack gap="300" blockAlign="center">
                      <Box background="bg-fill-info" padding="300" borderRadius="full">
                        <Icon source={CashDollarIcon} tone="text-inverse" />
                      </Box>
                      <BlockStack gap="100">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="p" variant="headingSm">PayPal</Text>
                          <Badge tone="success">Attivo</Badge>
                        </InlineStack>
                        <Text as="p" variant="bodySm" tone="subdued">{paypalEmail}</Text>
                      </BlockStack>
                    </InlineStack>
                  </div>
                ) : (
                  <div style={{ padding: "24px", backgroundColor: "#fef3cd", borderRadius: "12px", textAlign: "center" }}>
                    <Icon source={AlertTriangleIcon} tone="warning" />
                    <Text as="p" variant="bodyMd">Nessun metodo configurato</Text>
                    <Box paddingBlockStart="200">
                      <Button onClick={() => setConfigurePayoutOpen(true)} icon={PlusIcon}>
                        Aggiungi metodo
                      </Button>
                    </Box>
                  </div>
                )}

                <Divider />

                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">Prelievo minimo</Text>
                    <Text as="span" variant="bodyMd" fontWeight="medium">{balance.minWithdraw} {euro}</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">Tempo di accredito</Text>
                    <Text as="span" variant="bodyMd" fontWeight="medium">3-5 giorni lavorativi</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">Commissioni</Text>
                    <Text as="span" variant="bodyMd" fontWeight="medium" tone="success">Gratuite</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Storico pagamenti ricevuti */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Pagamenti ricevuti</Text>
                  <Button variant="plain">Vedi tutti</Button>
                </InlineStack>

                <div style={{ border: "1px solid #e1e3e5", borderRadius: "8px", overflow: "hidden" }}>
                  {payoutHistory.map((payout, index) => (
                    <div key={payout.id} style={{ padding: "12px 16px", borderBottom: index < payoutHistory.length - 1 ? "1px solid #e1e3e5" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <InlineStack gap="300" blockAlign="center">
                        <Box background="bg-fill-success" padding="200" borderRadius="full">
                          <Icon source={CheckCircleIcon} tone="text-inverse" />
                        </Box>
                        <BlockStack gap="050">
                          <Text as="p" variant="bodyMd" fontWeight="medium">Prelievo {payout.method}</Text>
                          <Text as="p" variant="bodySm" tone="subdued">{payout.date}</Text>
                        </BlockStack>
                      </InlineStack>
                      <BlockStack gap="050" inlineAlign="end">
                        <Text as="p" variant="bodyMd" fontWeight="semibold" tone="success">+{payout.amount} {euro}</Text>
                        <Badge tone="success" size="small">{payout.status}</Badge>
                      </BlockStack>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </Card>
          </BlockStack>

          {/* Colonna destra */}
          <BlockStack gap="400">
            {/* Ultime vendite */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Ultime vendite</Text>
                <BlockStack gap="300">
                  {recentSales.map((sale) => (
                    <InlineStack key={sale.id} align="space-between" blockAlign="center">
                      <BlockStack gap="050">
                        <Text as="p" variant="bodyMd" fontWeight="medium">{sale.product}</Text>
                        <Text as="p" variant="bodySm" tone="subdued">{sale.date}</Text>
                      </BlockStack>
                      <Text as="p" variant="bodyMd" fontWeight="semibold" tone="success">{sale.amount} {euro}</Text>
                    </InlineStack>
                  ))}
                </BlockStack>
                <Button fullWidth variant="plain">Vedi tutte le vendite</Button>
              </BlockStack>
            </Card>

            {/* Prossimo pagamento automatico */}
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={ClockIcon} tone="base" />
                  <Text as="h2" variant="headingMd">Prossimo pagamento</Text>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  I pagamenti vengono elaborati automaticamente il 1 e 15 di ogni mese.
                </Text>
                <Divider />
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">Data</Text>
                    <Text as="span" variant="bodyMd" fontWeight="medium">1 Gen 2026</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">Importo stimato</Text>
                    <Text as="span" variant="bodyMd" fontWeight="semibold" tone="success">{balance.available} {euro}</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Info fiscali */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Informazioni fiscali</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Ricordati di dichiarare i tuoi guadagni. Puoi scaricare il riepilogo annuale dalla sezione Documenti.
                </Text>
                <Button fullWidth variant="plain">Scarica riepilogo annuale</Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </InlineGrid>
      </BlockStack>

      {/* Modal Richiedi Prelievo */}
      <Modal
        open={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Richiedi prelievo"
        primaryAction={{
          content: "Richiedi prelievo",
          onAction: handleRequestPayout,
        }}
        secondaryActions={[
          { content: "Annulla", onAction: () => setPayoutModalOpen(false) },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Banner tone="info">
              <p>Disponibile per prelievo: <strong>{balance.available} {euro}</strong></p>
            </Banner>
            <TextField
              label="Importo da prelevare"
              type="number"
              value={withdrawAmount}
              onChange={setWithdrawAmount}
              prefix={euro}
              helpText={`Minimo ${balance.minWithdraw} ${euro}`}
              autoComplete="off"
            />
            <BlockStack gap="200">
              <Text as="p" variant="bodySm" tone="subdued">Il prelievo verra inviato a:</Text>
              <div style={{ padding: "12px", backgroundColor: "#f6f6f7", borderRadius: "8px" }}>
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={BankIcon} tone="base" />
                  <Text as="span" variant="bodyMd">{ibanValue}</Text>
                </InlineStack>
              </div>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Modal Configura Metodo */}
      <Modal
        open={configurePayoutOpen}
        onClose={() => setConfigurePayoutOpen(false)}
        title="Configura metodo di pagamento"
        primaryAction={{
          content: "Salva",
          onAction: () => setConfigurePayoutOpen(false),
        }}
        secondaryActions={[
          { content: "Annulla", onAction: () => setConfigurePayoutOpen(false) },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p" variant="bodyMd">Scegli come vuoi ricevere i tuoi guadagni:</Text>

            <div
              onClick={() => setPayoutMethod("iban")}
              style={{
                padding: "16px",
                border: payoutMethod === "iban" ? "2px solid #008060" : "1px solid #e1e3e5",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: payoutMethod === "iban" ? "#f0fdf4" : "#fff"
              }}
            >
              <InlineStack gap="300" blockAlign="center">
                <Icon source={BankIcon} tone={payoutMethod === "iban" ? "success" : "base"} />
                <BlockStack gap="100">
                  <Text as="p" variant="headingSm">Bonifico Bancario (IBAN)</Text>
                  <Text as="p" variant="bodySm" tone="subdued">Ricevi sul tuo conto corrente in 3-5 giorni</Text>
                </BlockStack>
              </InlineStack>
            </div>

            <div
              onClick={() => setPayoutMethod("paypal")}
              style={{
                padding: "16px",
                border: payoutMethod === "paypal" ? "2px solid #008060" : "1px solid #e1e3e5",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: payoutMethod === "paypal" ? "#f0fdf4" : "#fff"
              }}
            >
              <InlineStack gap="300" blockAlign="center">
                <Icon source={CashDollarIcon} tone={payoutMethod === "paypal" ? "success" : "base"} />
                <BlockStack gap="100">
                  <Text as="p" variant="headingSm">PayPal</Text>
                  <Text as="p" variant="bodySm" tone="subdued">Ricevi sul tuo account PayPal in 1-2 giorni</Text>
                </BlockStack>
              </InlineStack>
            </div>

            {payoutMethod === "iban" && (
              <TextField
                label="IBAN"
                value={ibanValue}
                onChange={setIbanValue}
                placeholder="IT60 X054 2811 1010 0000 0123 456"
                autoComplete="off"
              />
            )}

            {payoutMethod === "paypal" && (
              <TextField
                label="Email PayPal"
                type="email"
                value={paypalEmail}
                onChange={setPaypalEmail}
                placeholder="tuaemail@esempio.com"
                autoComplete="off"
              />
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
