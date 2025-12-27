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
  ProgressBar,
  Icon,
  Tabs,
  Banner,
} from "@shopify/polaris"
import {
  RefreshIcon,
  ExternalIcon,
  EditIcon,
  GlobeIcon,
  LockIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeCheckMarkIcon,
  ChartVerticalIcon,
  SettingsIcon,
  CodeIcon,
  ThemeIcon,
  SearchIcon,
  MobileIcon,
  DesktopIcon,
  NoteIcon,
  LinkIcon,
} from "@shopify/polaris-icons"

export default function NegozioOnlinePage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const siteUrl = "https://hamzamamma.github.io/con-mollica-o-senza"
  const domain = "con-mollica-o-senza.com"

  const stats = [
    { label: "Visitatori oggi", value: "1,247", change: "+12%", positive: true, icon: EyeCheckMarkIcon },
    { label: "Visualizzazioni", value: "3,892", change: "+8%", positive: true, icon: NoteIcon },
    { label: "Tasso conversione", value: "3.2%", change: "+0.5%", positive: true, icon: ChartVerticalIcon },
    { label: "Tempo medio", value: "2:45", change: "-10s", positive: true, icon: ClockIcon },
  ]

  const tabs = [
    { id: "preview", content: "Anteprima", icon: EyeCheckMarkIcon },
    { id: "theme", content: "Tema", icon: ThemeIcon },
    { id: "pages", content: "Pagine", icon: NoteIcon },
    { id: "navigation", content: "Navigazione", icon: LinkIcon },
  ]

  const themeInfo = {
    name: "Con Mollica Theme",
    version: "2.1.0",
    lastUpdate: "2 giorni fa",
    status: "Attivo",
  }

  const pages = [
    { name: "Home", path: "/", status: "Pubblicata", views: 2341 },
    { name: "Menu", path: "/menu", status: "Pubblicata", views: 1892 },
    { name: "Chi Siamo", path: "/about", status: "Pubblicata", views: 743 },
    { name: "Contatti", path: "/contact", status: "Pubblicata", views: 521 },
    { name: "Ordina Online", path: "/order", status: "Pubblicata", views: 1205 },
  ]

  const seoScore = 85

  return (
    <Page
      title="Negozio online"
      subtitle="Gestisci il tuo sito web e la presenza online"
      primaryAction={{
        content: "Personalizza tema",
        icon: ThemeIcon,
      }}
      secondaryActions={[
        {
          content: "Modifica codice",
          icon: CodeIcon,
        },
        {
          content: "Impostazioni",
          icon: SettingsIcon,
        },
      ]}
    >
      <BlockStack gap="600">
        {/* Stats Cards */}
        <InlineGrid columns={{ xs: 2, md: 4 }} gap="400">
          {stats.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Box
                    background="bg-surface-secondary"
                    padding="200"
                    borderRadius="200"
                  >
                    <Icon source={stat.icon} tone="base" />
                  </Box>
                  <Badge tone={stat.positive ? "success" : "critical"}>
                    {stat.change}
                  </Badge>
                </InlineStack>
                <BlockStack gap="100">
                  <Text as="p" variant="headingLg" fontWeight="semibold">
                    {stat.value}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {stat.label}
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Domain & SSL Status */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="300" blockAlign="center">
                <Box
                  background="bg-fill-success"
                  padding="200"
                  borderRadius="full"
                >
                  <Icon source={GlobeIcon} tone="text-inverse" />
                </Box>
                <BlockStack gap="050">
                  <Text as="h2" variant="headingMd">Dominio</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{domain}</Text>
                </BlockStack>
              </InlineStack>
              <InlineStack gap="300">
                <Badge tone="success" icon={LockIcon}>SSL Attivo</Badge>
                <Badge tone="success" icon={CheckCircleIcon}>Online</Badge>
                <Button url={siteUrl} external icon={ExternalIcon}>
                  Visita sito
                </Button>
              </InlineStack>
            </InlineStack>

            <Divider />

            <InlineGrid columns={3} gap="400">
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Stato DNS</Text>
                <InlineStack gap="200" blockAlign="center">
                  <Box
                    background="bg-fill-success"
                    padding="050"
                    borderRadius="full"
                    minWidth="8px"
                    minHeight="8px"
                  />
                  <Text as="p" variant="bodyMd" fontWeight="medium">Connesso</Text>
                </InlineStack>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Certificato SSL</Text>
                <InlineStack gap="200" blockAlign="center">
                  <Box
                    background="bg-fill-success"
                    padding="050"
                    borderRadius="full"
                    minWidth="8px"
                    minHeight="8px"
                  />
                  <Text as="p" variant="bodyMd" fontWeight="medium">Valido fino al 2026</Text>
                </InlineStack>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Velocità sito</Text>
                <InlineStack gap="200" blockAlign="center">
                  <Box
                    background="bg-fill-success"
                    padding="050"
                    borderRadius="full"
                    minWidth="8px"
                    minHeight="8px"
                  />
                  <Text as="p" variant="bodyMd" fontWeight="medium">Eccellente (92/100)</Text>
                </InlineStack>
              </BlockStack>
            </InlineGrid>
          </BlockStack>
        </Card>

        {/* Main Content Area */}
        <InlineGrid columns={{ xs: 1, lg: "2fr 1fr" }} gap="400">
          {/* Preview Section */}
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">Anteprima sito</Text>
                <InlineStack gap="200">
                  <Button
                    pressed={previewMode === "desktop"}
                    onClick={() => setPreviewMode("desktop")}
                    icon={DesktopIcon}
                    size="slim"
                  >
                    Desktop
                  </Button>
                  <Button
                    pressed={previewMode === "mobile"}
                    onClick={() => setPreviewMode("mobile")}
                    icon={MobileIcon}
                    size="slim"
                  >
                    Mobile
                  </Button>
                  <Button
                    onClick={() => setRefreshKey(k => k + 1)}
                    icon={RefreshIcon}
                    size="slim"
                  >
                    Aggiorna
                  </Button>
                </InlineStack>
              </InlineStack>

                            {previewMode === "desktop" ? (
                <div style={{
                  border: "1px solid #e1e3e5",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "8px 12px",
                    borderBottom: "1px solid #e1e3e5",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#febc2e" }} />
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#28c840" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "4px 12px", fontSize: "11px", border: "1px solid #e1e3e5" }}>
                        {domain}
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative", width: "100%", height: "280px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
                    <iframe key={`desktop-${refreshKey}`} src={siteUrl} title="Desktop" style={{ position: "absolute", top: 0, left: 0, width: "1280px", height: "800px", transform: "scale(0.42)", transformOrigin: "top left", border: "none" }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <div style={{ width: "260px", borderRadius: "36px", border: "10px solid #1a1a1a", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
                    <div style={{ height: "20px", backgroundColor: "#1a1a1a", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ width: "60px", height: "18px", backgroundColor: "#000", borderRadius: "0 0 12px 12px" }} />
                    </div>
                    <div style={{ position: "relative", width: "240px", height: "420px", overflow: "hidden", backgroundColor: "#fff" }}>
                      <iframe key={`mobile-${refreshKey}`} src={siteUrl} title="Mobile" style={{ position: "absolute", top: 0, left: 0, width: "375px", height: "667px", transform: "scale(0.64)", transformOrigin: "top left", border: "none" }} />
                    </div>
                    <div style={{ height: "20px", backgroundColor: "#1a1a1a", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ width: "80px", height: "4px", backgroundColor: "#fff", borderRadius: "2px" }} />
                    </div>
                  </div>
                </div>
              )}
            </BlockStack>
          </Card>

          {/* Sidebar */}
          <BlockStack gap="400">
            {/* Theme Info */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Tema attivo</Text>
                  <Badge tone="success">Attivo</Badge>
                </InlineStack>

                <div style={{
                  padding: "16px",
                  backgroundColor: "#f6f6f7",
                  borderRadius: "12px",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#5C6AC4",
                    borderRadius: "12px",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon source={ThemeIcon} tone="text-inverse" />
                  </div>
                  <Text as="p" variant="headingSm">{themeInfo.name}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    v{themeInfo.version} • Aggiornato {themeInfo.lastUpdate}
                  </Text>
                </div>

                <BlockStack gap="200">
                  <Button fullWidth>Personalizza</Button>
                  <Button fullWidth variant="plain">Cambia tema</Button>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* SEO Score */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Punteggio SEO</Text>
                  <Badge tone={seoScore >= 80 ? "success" : seoScore >= 60 ? "warning" : "critical"}>
                    {seoScore}/100
                  </Badge>
                </InlineStack>

                <ProgressBar progress={seoScore} tone="success" size="small" />

                <BlockStack gap="200">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={CheckCircleIcon} tone="success" />
                    <Text as="p" variant="bodySm">Meta title ottimizzato</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={CheckCircleIcon} tone="success" />
                    <Text as="p" variant="bodySm">Meta description presente</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={CheckCircleIcon} tone="success" />
                    <Text as="p" variant="bodySm">Immagini ottimizzate</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={ClockIcon} tone="warning" />
                    <Text as="p" variant="bodySm">Velocità mobile da migliorare</Text>
                  </InlineStack>
                </BlockStack>

                <Button fullWidth variant="plain" icon={SearchIcon}>
                  Analizza SEO completo
                </Button>
              </BlockStack>
            </Card>

            {/* Quick Actions */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Azioni rapide</Text>
                <BlockStack gap="200">
                  <Button fullWidth variant="plain" textAlign="left" icon={NoteIcon}>
                    Aggiungi nuova pagina
                  </Button>
                  <Button fullWidth variant="plain" textAlign="left" icon={LinkIcon}>
                    Gestisci menu
                  </Button>
                  <Button fullWidth variant="plain" textAlign="left" icon={GlobeIcon}>
                    Impostazioni dominio
                  </Button>
                  <Button fullWidth variant="plain" textAlign="left" icon={CodeIcon}>
                    Modifica codice
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </InlineGrid>

        {/* Pages Table */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">Pagine del sito</Text>
              <Button icon={NoteIcon}>Aggiungi pagina</Button>
            </InlineStack>

            <div style={{
              border: "1px solid #e1e3e5",
              borderRadius: "8px",
              overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f6f6f7" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Pagina</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#637381" }}>URL</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Stato</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Visualizzazioni</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: 500, color: "#637381" }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, index) => (
                    <tr key={index} style={{ borderTop: "1px solid #e1e3e5" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <Text as="p" variant="bodyMd" fontWeight="medium">{page.name}</Text>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Text as="p" variant="bodySm" tone="subdued">{page.path}</Text>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge tone="success">{page.status}</Badge>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <Text as="p" variant="bodyMd">{page.views.toLocaleString()}</Text>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <InlineStack gap="200" align="end">
                          <Button size="slim" variant="plain" icon={EditIcon}>Modifica</Button>
                          <Button size="slim" variant="plain" icon={ExternalIcon} url={`${siteUrl}${page.path}`} external />
                        </InlineStack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
