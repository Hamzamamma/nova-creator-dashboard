"use client"

import { useState } from "react"
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Box,
} from "@shopify/polaris"
import {
  RefreshIcon,
  ExternalIcon,
  EditIcon,
  DesktopIcon,
  MobileIcon,
} from "@shopify/polaris-icons"

export default function NegozioOnlinePage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const siteUrl = "http://localhost:8080"

  return (
    <Page
      title="Negozio online"
      subtitle="Anteprima del tuo sito web"
      primaryAction={{
        content: "Modifica tema",
        icon: EditIcon,
      }}
      secondaryActions={[
        {
          content: "Aggiorna",
          icon: RefreshIcon,
          onAction: () => setRefreshKey(k => k + 1),
        },
        {
          content: "Apri sito",
          icon: ExternalIcon,
          url: siteUrl,
          external: true,
        },
      ]}
    >
      <BlockStack gap="500">
        <InlineStack gap="500" align="start">
          {/* Desktop Preview */}
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="200" blockAlign="center">
                <DesktopIcon />
                <Text as="h2" variant="headingMd">Desktop</Text>
              </InlineStack>
              <div style={{
                border: "1px solid #e1e3e5",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fff",
              }}>
                {/* Browser Chrome */}
                <div style={{
                  backgroundColor: "#f6f6f7",
                  padding: "8px 16px",
                  borderBottom: "1px solid #e1e3e5",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#febc2e" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#28c840" }} />
                  </div>
                  <div style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}>
                    <div style={{
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      color: "#637381",
                      border: "1px solid #e1e3e5",
                    }}>
                      con-mollica-o-senza.com
                    </div>
                  </div>
                </div>
                {/* Iframe Desktop */}
                <div style={{ height: "400px", overflow: "hidden" }}>
                  <iframe
                    key={`desktop-${refreshKey}`}
                    src={siteUrl}
                    title="Anteprima desktop"
                    style={{
                      border: "none",
                      width: "1280px",
                      height: "800px",
                      transform: "scale(0.5)",
                      transformOrigin: "top left",
                    }}
                  />
                </div>
              </div>
            </BlockStack>
          </Card>

          {/* Mobile Preview */}
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="200" blockAlign="center">
                <MobileIcon />
                <Text as="h2" variant="headingMd">Mobile</Text>
              </InlineStack>
              <div style={{
                width: "220px",
                border: "8px solid #1a1a1a",
                borderRadius: "32px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}>
                {/* Phone Notch */}
                <div style={{
                  backgroundColor: "#1a1a1a",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: "48px",
                    height: "12px",
                    backgroundColor: "#000",
                    borderRadius: "0 0 8px 8px",
                  }} />
                </div>
                {/* Iframe Mobile */}
                <div style={{ height: "400px", overflow: "hidden" }}>
                  <iframe
                    key={`mobile-${refreshKey}`}
                    src={siteUrl}
                    title="Anteprima mobile"
                    style={{
                      border: "none",
                      width: "375px",
                      height: "667px",
                      transform: "scale(0.58)",
                      transformOrigin: "top left",
                    }}
                  />
                </div>
                {/* Home Indicator */}
                <div style={{
                  backgroundColor: "#1a1a1a",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: "80px",
                    height: "4px",
                    backgroundColor: "#4a4a4a",
                    borderRadius: "2px",
                  }} />
                </div>
              </div>
            </BlockStack>
          </Card>
        </InlineStack>
      </BlockStack>
    </Page>
  )
}
