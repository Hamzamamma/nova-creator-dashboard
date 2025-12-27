"use client";

import { useState, useCallback } from "react";
import {
  Modal,
  Button,
  BlockStack,
  InlineStack,
  Text,
  Checkbox,
  RadioButton,
  Card,
  Banner,
  ProgressBar,
  Icon,
  Box,
  Divider,
} from "@shopify/polaris";
import {
  ExportIcon,
  FileIcon,
  EmailIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";
import type { DateRange, ExportOptions } from "../types";
import { formatDateRange } from "./DateRangePicker";

interface DataExportProps {
  dateRange: DateRange;
  availableSections: { id: string; label: string; description?: string }[];
  onExport: (options: ExportOptions) => Promise<void>;
  title?: string;
}

export function DataExport({
  dateRange,
  availableSections,
  onExport,
  title = "Esporta Dati",
}: DataExportProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [format, setFormat] = useState<"csv" | "pdf" | "excel">("csv");
  const [selectedSections, setSelectedSections] = useState<string[]>(
    availableSections.map((s) => s.id)
  );
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleModal = useCallback(() => {
    setModalOpen((open) => !open);
    if (!modalOpen) {
      // Reset state when opening
      setExportComplete(false);
      setExportProgress(0);
      setError(null);
    }
  }, [modalOpen]);

  const toggleSection = useCallback((sectionId: string) => {
    setSelectedSections((sections) => {
      if (sections.includes(sectionId)) {
        return sections.filter((id) => id !== sectionId);
      }
      return [...sections, sectionId];
    });
  }, []);

  const selectAllSections = useCallback(() => {
    setSelectedSections(availableSections.map((s) => s.id));
  }, [availableSections]);

  const deselectAllSections = useCallback(() => {
    setSelectedSections([]);
  }, []);

  const handleExport = useCallback(async () => {
    if (selectedSections.length === 0) {
      setError("Seleziona almeno una sezione da esportare");
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await onExport({
        format,
        dateRange,
        includeCharts: format === "pdf" && includeCharts,
        sections: selectedSections,
      });

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportComplete(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Si e' verificato un errore durante l'esportazione"
      );
    } finally {
      setIsExporting(false);
    }
  }, [format, dateRange, includeCharts, selectedSections, onExport]);

  const getFormatDescription = (fmt: "csv" | "pdf" | "excel") => {
    switch (fmt) {
      case "csv":
        return "File CSV compatibile con Excel e Google Sheets";
      case "pdf":
        return "Documento PDF con grafici e formattazione";
      case "excel":
        return "File Excel (.xlsx) con fogli multipli";
    }
  };

  const activator = (
    <Button icon={ExportIcon} onClick={toggleModal}>
      Esporta
    </Button>
  );

  return (
    <>
      {activator}
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        title={title}
        primaryAction={{
          content: exportComplete ? "Chiudi" : "Esporta",
          onAction: exportComplete ? toggleModal : handleExport,
          loading: isExporting,
          disabled: isExporting || selectedSections.length === 0,
        }}
        secondaryActions={
          exportComplete
            ? undefined
            : [
                {
                  content: "Annulla",
                  onAction: toggleModal,
                },
              ]
        }
      >
        <Modal.Section>
          {exportComplete ? (
            <BlockStack gap="400" align="center">
              <Box padding="400">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon source={CheckCircleIcon} tone="success" />
                  </div>
                  <BlockStack gap="200" align="center">
                    <Text as="h2" variant="headingLg" alignment="center">
                      Esportazione completata!
                    </Text>
                    <Text as="p" tone="subdued" alignment="center">
                      Il file e' stato generato e scaricato con successo.
                    </Text>
                  </BlockStack>
                </div>
              </Box>
            </BlockStack>
          ) : (
            <BlockStack gap="500">
              {error && (
                <Banner tone="critical" onDismiss={() => setError(null)}>
                  {error}
                </Banner>
              )}

              {isExporting && (
                <Box padding="400">
                  <BlockStack gap="300">
                    <Text as="p" variant="bodyMd">
                      Generazione in corso...
                    </Text>
                    <ProgressBar progress={exportProgress} size="small" />
                    <Text as="p" variant="bodySm" tone="subdued">
                      {exportProgress}% completato
                    </Text>
                  </BlockStack>
                </Box>
              )}

              {!isExporting && (
                <>
                  {/* Date Range Info */}
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">
                        Periodo selezionato
                      </Text>
                      <Text as="p" variant="bodyMd">
                        {formatDateRange(dateRange)}
                      </Text>
                    </BlockStack>
                  </Card>

                  {/* Format Selection */}
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm">
                      Formato di esportazione
                    </Text>
                    <BlockStack gap="200">
                      <RadioButton
                        label="CSV"
                        helpText={getFormatDescription("csv")}
                        checked={format === "csv"}
                        id="format-csv"
                        name="format"
                        onChange={() => setFormat("csv")}
                      />
                      <RadioButton
                        label="PDF"
                        helpText={getFormatDescription("pdf")}
                        checked={format === "pdf"}
                        id="format-pdf"
                        name="format"
                        onChange={() => setFormat("pdf")}
                      />
                      <RadioButton
                        label="Excel"
                        helpText={getFormatDescription("excel")}
                        checked={format === "excel"}
                        id="format-excel"
                        name="format"
                        onChange={() => setFormat("excel")}
                      />
                    </BlockStack>
                  </BlockStack>

                  {/* PDF Options */}
                  {format === "pdf" && (
                    <BlockStack gap="200">
                      <Divider />
                      <Checkbox
                        label="Includi grafici"
                        helpText="Aggiungi visualizzazioni grafiche al report PDF"
                        checked={includeCharts}
                        onChange={setIncludeCharts}
                      />
                    </BlockStack>
                  )}

                  <Divider />

                  {/* Section Selection */}
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="h3" variant="headingSm">
                        Sezioni da includere
                      </Text>
                      <InlineStack gap="200">
                        <Button
                          size="slim"
                          onClick={selectAllSections}
                          variant="plain"
                        >
                          Seleziona tutto
                        </Button>
                        <Button
                          size="slim"
                          onClick={deselectAllSections}
                          variant="plain"
                        >
                          Deseleziona tutto
                        </Button>
                      </InlineStack>
                    </InlineStack>
                    <BlockStack gap="200">
                      {availableSections.map((section) => (
                        <Checkbox
                          key={section.id}
                          label={section.label}
                          helpText={section.description}
                          checked={selectedSections.includes(section.id)}
                          onChange={() => toggleSection(section.id)}
                        />
                      ))}
                    </BlockStack>
                  </BlockStack>

                  {/* Summary */}
                  <Box
                    padding="300"
                    background="bg-surface-secondary"
                    borderRadius="200"
                  >
                    <InlineStack gap="200" align="space-between">
                      <Text as="span" variant="bodySm" tone="subdued">
                        {selectedSections.length} sezioni selezionate
                      </Text>
                      <Text as="span" variant="bodySm" tone="subdued">
                        Formato: {format.toUpperCase()}
                      </Text>
                    </InlineStack>
                  </Box>
                </>
              )}
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
    </>
  );
}

// Simple export button with direct download
export function QuickExportButton({
  onExport,
  format = "csv",
  label = "Esporta CSV",
}: {
  onExport: () => Promise<void>;
  format?: "csv" | "pdf" | "excel";
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      await onExport();
    } finally {
      setLoading(false);
    }
  }, [onExport]);

  return (
    <Button icon={ExportIcon} onClick={handleClick} loading={loading}>
      {label}
    </Button>
  );
}

// Export sections configuration for different pages
export const ANALYTICS_EXPORT_SECTIONS = [
  { id: "metrics", label: "Metriche principali", description: "Revenue, ordini, conversioni" },
  { id: "revenue-chart", label: "Grafico revenue", description: "Andamento delle vendite" },
  { id: "orders-chart", label: "Grafico ordini", description: "Trend ordini nel periodo" },
  { id: "top-products", label: "Top prodotti", description: "Prodotti piu' venduti" },
  { id: "top-customers", label: "Top clienti", description: "Clienti con piu' acquisti" },
  { id: "traffic-sources", label: "Sorgenti traffico", description: "Origine dei visitatori" },
  { id: "sales-location", label: "Vendite per regione", description: "Distribuzione geografica" },
];

export const SALES_EXPORT_SECTIONS = [
  { id: "sales-overview", label: "Panoramica vendite", description: "Totali e confronti" },
  { id: "category-breakdown", label: "Vendite per categoria", description: "Suddivisione per tipo prodotto" },
  { id: "channel-breakdown", label: "Vendite per canale", description: "Performance canali di vendita" },
  { id: "discount-impact", label: "Impatto sconti", description: "Analisi sconti applicati" },
  { id: "refund-analysis", label: "Analisi rimborsi", description: "Resi e rimborsi" },
];

export const CUSTOMER_EXPORT_SECTIONS = [
  { id: "customer-overview", label: "Panoramica clienti", description: "Nuovi vs. ricorrenti" },
  { id: "customer-segments", label: "Segmenti clienti", description: "Distribuzione per categoria" },
  { id: "lifetime-value", label: "Valore cliente", description: "LTV e metriche correlate" },
  { id: "acquisition", label: "Acquisizione", description: "Costi e canali acquisizione" },
  { id: "top-customers", label: "Top clienti", description: "Clienti migliori per revenue" },
];

export default DataExport;
