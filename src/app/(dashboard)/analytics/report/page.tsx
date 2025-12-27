"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  InlineGrid,
  Badge,
  Icon,
  Box,
  Divider,
  Tabs,
  Button,
  Spinner,
  Modal,
  TextField,
  Select,
  Checkbox,
  IndexTable,
  useIndexResourceState,
  Banner,
  EmptyState,
  FormLayout,
  ChoiceList,
  Tag,
} from "@shopify/polaris";
import {
  FileIcon,
  CalendarIcon,
  EmailIcon,
  RefreshIcon,
  PlusIcon,
  DeleteIcon,
  EditIcon,
  ExportIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseCircleIcon,
  CashDollarIcon,
  PersonIcon,
  ProductIcon,
  ChartVerticalIcon,
} from "@shopify/polaris-icons";

import { DateRangePicker, useDateRange, formatDateRange } from "../components/DateRangePicker";

import analyticsData from "../data.json";
import type {
  AnalyticsData,
  ReportTemplate,
  ScheduledReport,
  ReportHistory,
} from "../types";

const data = analyticsData as unknown as AnalyticsData;

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  // Form states
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("sales");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportFrequency, setReportFrequency] = useState("weekly");
  const [reportRecipients, setReportRecipients] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "metrics",
    "charts",
    "tables",
  ]);

  const { dateRange, setDateRange } = useDateRange("last30days");

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const tabs = [
    { id: "templates", content: "Template", accessibilityLabel: "Template" },
    { id: "scheduled", content: "Programmati", accessibilityLabel: "Programmati" },
    { id: "history", content: "Cronologia", accessibilityLabel: "Cronologia" },
    { id: "custom", content: "Personalizzato", accessibilityLabel: "Personalizzato" },
  ];

  // Template data
  const templateRows = (data.reportTemplates || []) as ReportTemplate[];
  const { selectedResources: selectedTemplates, allResourcesSelected: allTemplatesSelected, handleSelectionChange: handleTemplateSelectionChange } =
    useIndexResourceState(templateRows.map((t) => ({ id: t.id })));

  // Scheduled reports data
  const scheduledRows = (data.scheduledReports || []) as ScheduledReport[];
  const { selectedResources: selectedScheduled, allResourcesSelected: allScheduledSelected, handleSelectionChange: handleScheduledSelectionChange } =
    useIndexResourceState(scheduledRows.map((s) => ({ id: s.id })));

  // History data
  const historyRows = (data.reportHistory || []) as ReportHistory[];
  const { selectedResources: selectedHistory, allResourcesSelected: allHistorySelected, handleSelectionChange: handleHistorySelectionChange } =
    useIndexResourceState(historyRows.map((h) => ({ id: h.id })));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return CashDollarIcon;
      case "customers":
        return PersonIcon;
      case "products":
        return ProductIcon;
      case "financial":
        return ChartVerticalIcon;
      default:
        return FileIcon;
    }
  };

  const getTypeBadgeTone = (type: string): "success" | "info" | "warning" | "attention" => {
    switch (type) {
      case "sales":
        return "success";
      case "customers":
        return "info";
      case "products":
        return "warning";
      case "financial":
        return "attention";
      default:
        return "info";
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case "pdf":
        return <Badge tone="critical">PDF</Badge>;
      case "excel":
        return <Badge tone="success">Excel</Badge>;
      case "csv":
        return <Badge tone="info">CSV</Badge>;
      default:
        return <Badge>{format.toUpperCase()}</Badge>;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Giornaliero";
      case "weekly":
        return "Settimanale";
      case "monthly":
        return "Mensile";
      default:
        return frequency;
    }
  };

  const handleGenerateReport = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template);
    console.log("Generating report:", template.name);
    // Simulate report generation
    setTimeout(() => {
      alert(`Report "${template.name}" generato con successo!`);
    }, 1500);
  }, []);

  const handleScheduleReport = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportName(template.name);
    setReportType(template.type);
    setScheduleModalOpen(true);
  }, []);

  const handleCreateReport = useCallback(() => {
    console.log("Creating custom report:", {
      name: reportName,
      type: reportType,
      format: reportFormat,
      sections: selectedSections,
      dateRange,
    });
    setCreateModalOpen(false);
    // Reset form
    setReportName("");
    setSelectedSections(["metrics", "charts", "tables"]);
  }, [reportName, reportType, reportFormat, selectedSections, dateRange]);

  const handleSaveSchedule = useCallback(() => {
    console.log("Saving schedule:", {
      template: selectedTemplate,
      frequency: reportFrequency,
      format: reportFormat,
      recipients: reportRecipients.split(",").map((r) => r.trim()),
    });
    setScheduleModalOpen(false);
    // Reset form
    setReportFrequency("weekly");
    setReportRecipients("");
  }, [selectedTemplate, reportFrequency, reportFormat, reportRecipients]);

  const handleDownloadReport = useCallback((report: ReportHistory) => {
    console.log("Downloading:", report.downloadUrl);
    alert(`Download avviato: ${report.name}`);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Page title="Report" backAction={{ content: "Analytics", url: "/analytics" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Report"
      subtitle="Genera, programma e scarica report analitici"
      backAction={{ content: "Analytics", url: "/analytics" }}
      primaryAction={{
        content: "Nuovo Report",
        icon: PlusIcon,
        onAction: () => setCreateModalOpen(true),
      }}
      secondaryActions={[
        {
          content: "Aggiorna",
          icon: RefreshIcon,
          onAction: handleRefresh,
        },
      ]}
    >
      <BlockStack gap="600">
        {/* Quick Stats */}
        <InlineGrid columns={{ xs: 2, sm: 4 }} gap="400">
          <Card>
            <BlockStack gap="200">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={FileIcon} tone="base" />
                <Text as="span" variant="bodySm" tone="subdued">Template</Text>
              </InlineStack>
              <Text as="p" variant="headingLg" fontWeight="bold">
                {templateRows.length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={ClockIcon} tone="base" />
                <Text as="span" variant="bodySm" tone="subdued">Programmati</Text>
              </InlineStack>
              <Text as="p" variant="headingLg" fontWeight="bold">
                {scheduledRows.filter((s) => s.isActive).length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={CheckCircleIcon} tone="base" />
                <Text as="span" variant="bodySm" tone="subdued">Generati</Text>
              </InlineStack>
              <Text as="p" variant="headingLg" fontWeight="bold">
                {historyRows.length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={CalendarIcon} tone="base" />
                <Text as="span" variant="bodySm" tone="subdued">Ultimo</Text>
              </InlineStack>
              <Text as="p" variant="headingLg" fontWeight="bold">
                Oggi
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* Tabs */}
        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="400">
              {selectedTab === 0 && (
                <BlockStack gap="400">
                  {/* Templates */}
                  <Text as="h2" variant="headingMd">Template Report</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Seleziona un template per generare rapidamente un report o programmarne l'invio automatico.
                  </Text>

                  <IndexTable
                    resourceName={{ singular: "template", plural: "template" }}
                    itemCount={templateRows.length}
                    selectedItemsCount={allTemplatesSelected ? "All" : selectedTemplates.length}
                    onSelectionChange={handleTemplateSelectionChange}
                    headings={[
                      { title: "Nome" },
                      { title: "Tipo" },
                      { title: "Frequenza" },
                      { title: "Ultimo Generato" },
                      { title: "Programmato" },
                      { title: "Azioni" },
                    ]}
                    selectable={false}
                  >
                    {templateRows.map((template, index) => (
                      <IndexTable.Row
                        id={template.id}
                        key={template.id}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <InlineStack gap="300" blockAlign="center">
                            <Icon source={getTypeIcon(template.type)} tone="base" />
                            <BlockStack gap="050">
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {template.name}
                              </Text>
                              <Text as="span" variant="bodySm" tone="subdued">
                                {template.description}
                              </Text>
                            </BlockStack>
                          </InlineStack>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Badge tone={getTypeBadgeTone(template.type)}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </Badge>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd">
                            {template.frequency ? getFrequencyLabel(template.frequency) : "-"}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd">
                            {template.lastGenerated
                              ? formatDate(template.lastGenerated)
                              : "Mai"}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          {template.isScheduled ? (
                            <Badge tone="success">
                              <InlineStack gap="100" blockAlign="center">
                                <Icon source={CheckCircleIcon} />
                                <span>Attivo</span>
                              </InlineStack>
                            </Badge>
                          ) : (
                            <Badge tone="attention">Non attivo</Badge>
                          )}
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <InlineStack gap="200">
                            <Button
                              size="slim"
                              onClick={() => handleGenerateReport(template)}
                            >
                              Genera
                            </Button>
                            <Button
                              size="slim"
                              variant="plain"
                              onClick={() => handleScheduleReport(template)}
                            >
                              Programma
                            </Button>
                          </InlineStack>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    ))}
                  </IndexTable>
                </BlockStack>
              )}

              {selectedTab === 1 && (
                <BlockStack gap="400">
                  {/* Scheduled Reports */}
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingMd">Report Programmati</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Gestisci i report automatici e le loro pianificazioni.
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  {scheduledRows.length === 0 ? (
                    <EmptyState
                      heading="Nessun report programmato"
                      action={{
                        content: "Programma un report",
                        onAction: () => setSelectedTab(0),
                      }}
                      image=""
                    >
                      <p>Vai alla sezione Template per programmare il tuo primo report automatico.</p>
                    </EmptyState>
                  ) : (
                    <IndexTable
                      resourceName={{ singular: "report", plural: "report" }}
                      itemCount={scheduledRows.length}
                      selectedItemsCount={allScheduledSelected ? "All" : selectedScheduled.length}
                      onSelectionChange={handleScheduledSelectionChange}
                      headings={[
                        { title: "Nome" },
                        { title: "Frequenza" },
                        { title: "Prossima Esecuzione" },
                        { title: "Formato" },
                        { title: "Destinatari" },
                        { title: "Stato" },
                        { title: "Azioni" },
                      ]}
                      selectable={false}
                    >
                      {scheduledRows.map((scheduled, index) => (
                        <IndexTable.Row
                          id={scheduled.id}
                          key={scheduled.id}
                          position={index}
                        >
                          <IndexTable.Cell>
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {scheduled.name}
                            </Text>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Badge>{getFrequencyLabel(scheduled.frequency)}</Badge>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Text as="span" variant="bodyMd">
                              {formatDate(scheduled.nextRun)}
                            </Text>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            {getFormatBadge(scheduled.format)}
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <InlineStack gap="100" wrap>
                              {scheduled.recipients.slice(0, 2).map((email, i) => (
                                <Tag key={i}>{email}</Tag>
                              ))}
                              {scheduled.recipients.length > 2 && (
                                <Tag>+{scheduled.recipients.length - 2}</Tag>
                              )}
                            </InlineStack>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            {scheduled.isActive ? (
                              <Badge tone="success">
                                <InlineStack gap="100" blockAlign="center">
                                  <Icon source={PlayIcon} />
                                  <span>Attivo</span>
                                </InlineStack>
                              </Badge>
                            ) : (
                              <Badge tone="attention">
                                <InlineStack gap="100" blockAlign="center">
                                  <Icon source={PauseCircleIcon} />
                                  <span>In pausa</span>
                                </InlineStack>
                              </Badge>
                            )}
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <InlineStack gap="200">
                              <Button size="slim" icon={EditIcon} variant="plain" accessibilityLabel="Modifica" />
                              <Button size="slim" icon={DeleteIcon} variant="plain" tone="critical" accessibilityLabel="Elimina" />
                            </InlineStack>
                          </IndexTable.Cell>
                        </IndexTable.Row>
                      ))}
                    </IndexTable>
                  )}
                </BlockStack>
              )}

              {selectedTab === 2 && (
                <BlockStack gap="400">
                  {/* History */}
                  <Text as="h2" variant="headingMd">Cronologia Report</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Scarica i report generati in precedenza.
                  </Text>

                  <IndexTable
                    resourceName={{ singular: "report", plural: "report" }}
                    itemCount={historyRows.length}
                    selectedItemsCount={allHistorySelected ? "All" : selectedHistory.length}
                    onSelectionChange={handleHistorySelectionChange}
                    headings={[
                      { title: "Nome" },
                      { title: "Tipo" },
                      { title: "Generato" },
                      { title: "Formato" },
                      { title: "Dimensione" },
                      { title: "Azioni" },
                    ]}
                    selectable={false}
                  >
                    {historyRows.map((report, index) => (
                      <IndexTable.Row
                        id={report.id}
                        key={report.id}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <InlineStack gap="200" blockAlign="center">
                            <Icon source={FileIcon} tone="base" />
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {report.name}
                            </Text>
                          </InlineStack>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Badge tone={getTypeBadgeTone(report.type)}>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </Badge>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd">
                            {formatDate(report.generatedAt)}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          {getFormatBadge(report.format)}
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodyMd">
                            {report.size}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Button
                            size="slim"
                            icon={ExportIcon}
                            onClick={() => handleDownloadReport(report)}
                          >
                            Scarica
                          </Button>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    ))}
                  </IndexTable>
                </BlockStack>
              )}

              {selectedTab === 3 && (
                <BlockStack gap="500">
                  {/* Custom Report Builder */}
                  <Text as="h2" variant="headingMd">Costruttore Report Personalizzato</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Crea un report personalizzato selezionando le sezioni da includere.
                  </Text>

                  <Layout>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="400">
                          <Text as="h3" variant="headingSm">Periodo</Text>
                          <DateRangePicker
                            selectedRange={dateRange}
                            onRangeChange={setDateRange}
                          />
                        </BlockStack>
                      </Card>
                    </Layout.Section>

                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="400">
                          <Text as="h3" variant="headingSm">Tipo Report</Text>
                          <Select
                            label="Categoria"
                            labelHidden
                            options={[
                              { label: "Vendite", value: "sales" },
                              { label: "Clienti", value: "customers" },
                              { label: "Prodotti", value: "products" },
                              { label: "Finanziario", value: "financial" },
                            ]}
                            value={reportType}
                            onChange={setReportType}
                          />
                        </BlockStack>
                      </Card>
                    </Layout.Section>

                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="400">
                          <Text as="h3" variant="headingSm">Formato</Text>
                          <Select
                            label="Formato file"
                            labelHidden
                            options={[
                              { label: "PDF", value: "pdf" },
                              { label: "Excel (.xlsx)", value: "excel" },
                              { label: "CSV", value: "csv" },
                            ]}
                            value={reportFormat}
                            onChange={setReportFormat}
                          />
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                  </Layout>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h3" variant="headingSm">Sezioni da Includere</Text>
                      <ChoiceList
                        allowMultiple
                        title="Scegli le sezioni"
                        titleHidden
                        choices={[
                          { label: "Metriche principali (KPI)", value: "metrics" },
                          { label: "Grafici e visualizzazioni", value: "charts" },
                          { label: "Tabelle dati dettagliate", value: "tables" },
                          { label: "Confronto periodo precedente", value: "comparison" },
                          { label: "Top prodotti/clienti", value: "top-lists" },
                          { label: "Analisi tendenze", value: "trends" },
                          { label: "Raccomandazioni", value: "recommendations" },
                        ]}
                        selected={selectedSections}
                        onChange={setSelectedSections}
                      />
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h3" variant="headingSm">Nome Report</Text>
                      <TextField
                        label="Nome"
                        labelHidden
                        value={reportName}
                        onChange={setReportName}
                        placeholder="es. Report Vendite Dicembre 2024"
                        autoComplete="off"
                      />
                    </BlockStack>
                  </Card>

                  <InlineStack gap="300">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleCreateReport}
                      disabled={!reportName || selectedSections.length === 0}
                    >
                      Genera Report
                    </Button>
                    <Button size="large">
                      Salva come Template
                    </Button>
                  </InlineStack>

                  <Banner tone="info">
                    <p>
                      Il report verra' generato in formato {reportFormat.toUpperCase()} e scaricato automaticamente.
                      Per report di grandi dimensioni, il processo potrebbe richiedere alcuni minuti.
                    </p>
                  </Banner>
                </BlockStack>
              )}
            </Box>
          </Tabs>
        </Card>

        {/* Navigation */}
        <Card>
          <InlineStack gap="300" align="center" blockAlign="center">
            <Text as="span" variant="bodyMd" tone="subdued">
              Altre analisi:
            </Text>
            <Button onClick={() => router.push("/analytics")}>
              Panoramica
            </Button>
            <Button onClick={() => router.push("/analytics/vendite")}>
              Analisi Vendite
            </Button>
            <Button onClick={() => router.push("/analytics/clienti")}>
              Analisi Clienti
            </Button>
          </InlineStack>
        </Card>
      </BlockStack>

      {/* Create Report Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nuovo Report Rapido"
        primaryAction={{
          content: "Genera",
          onAction: handleCreateReport,
          disabled: !reportName,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setCreateModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Nome Report"
              value={reportName}
              onChange={setReportName}
              placeholder="es. Report Vendite Q4"
              autoComplete="off"
            />
            <Select
              label="Tipo"
              options={[
                { label: "Vendite", value: "sales" },
                { label: "Clienti", value: "customers" },
                { label: "Prodotti", value: "products" },
                { label: "Finanziario", value: "financial" },
              ]}
              value={reportType}
              onChange={setReportType}
            />
            <Select
              label="Formato"
              options={[
                { label: "PDF", value: "pdf" },
                { label: "Excel", value: "excel" },
                { label: "CSV", value: "csv" },
              ]}
              value={reportFormat}
              onChange={setReportFormat}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>

      {/* Schedule Report Modal */}
      <Modal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Programma Report"
        primaryAction={{
          content: "Salva",
          onAction: handleSaveSchedule,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setScheduleModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Nome"
              value={selectedTemplate?.name || reportName}
              onChange={setReportName}
              autoComplete="off"
              disabled
            />
            <Select
              label="Frequenza"
              options={[
                { label: "Giornaliero", value: "daily" },
                { label: "Settimanale", value: "weekly" },
                { label: "Mensile", value: "monthly" },
              ]}
              value={reportFrequency}
              onChange={setReportFrequency}
            />
            <Select
              label="Formato"
              options={[
                { label: "PDF", value: "pdf" },
                { label: "Excel", value: "excel" },
                { label: "CSV", value: "csv" },
              ]}
              value={reportFormat}
              onChange={setReportFormat}
            />
            <TextField
              label="Destinatari"
              value={reportRecipients}
              onChange={setReportRecipients}
              placeholder="email1@example.com, email2@example.com"
              helpText="Separa gli indirizzi email con una virgola"
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
