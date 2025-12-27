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
  ProgressBar,
  IndexTable,
  useIndexResourceState,
  Avatar,
  Banner,
  Tooltip,
} from "@shopify/polaris";
import {
  PersonIcon,
  CashDollarIcon,
  OrderIcon,
  ChartVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  HeartIcon,
  StarIcon,
  AlertCircleIcon,
  PersonAddIcon,
  PersonRemoveIcon,
} from "@shopify/polaris-icons";

import { MetricCard, MetricCardCompact } from "../components/MetricCard";
import {
  RevenueChart,
  DonutChart,
  HorizontalBarChart,
  OrdersBarChart,
} from "../components/SimpleChart";
import { DateRangePicker, useDateRange } from "../components/DateRangePicker";
import { DataExport, CUSTOMER_EXPORT_SECTIONS } from "../components/DataExport";

import analyticsData from "../data.json";
import type {
  AnalyticsData,
  TopCustomer,
  CustomerSegment,
} from "../types";

const data = analyticsData as unknown as AnalyticsData;

export default function ClientiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    dateRange,
    setDateRange,
    comparisonRange,
  } = useDateRange("last30days");

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleExport = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Export completed");
  }, []);

  const tabs = [
    { id: "overview", content: "Panoramica", accessibilityLabel: "Panoramica" },
    { id: "segments", content: "Segmenti", accessibilityLabel: "Segmenti" },
    { id: "top-customers", content: "Top Clienti", accessibilityLabel: "Top Clienti" },
    { id: "lifetime-value", content: "Lifetime Value", accessibilityLabel: "Lifetime Value" },
    { id: "acquisition", content: "Acquisizione", accessibilityLabel: "Acquisizione" },
  ];

  // Calculate segment donut data
  const segmentDonutData = useMemo(() => {
    return (data.customerSegments || []).map((seg) => ({
      name: seg.name,
      value: seg.count,
      percentage: seg.percentage,
    }));
  }, []);

  // Calculate revenue by segment
  const segmentRevenueData = useMemo(() => {
    return (data.customerSegments || []).map((seg) => ({
      name: seg.name,
      value: seg.totalRevenue,
    }));
  }, []);

  // Customer trend data (mock)
  const customerTrendData = useMemo(() => {
    return [
      { date: "2024-12-01", label: "Sett 1", value: 785, previousValue: 720 },
      { date: "2024-12-08", label: "Sett 2", value: 825, previousValue: 745 },
      { date: "2024-12-15", label: "Sett 3", value: 892, previousValue: 798 },
      { date: "2024-12-22", label: "Sett 4", value: 943, previousValue: 856 },
    ];
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("it-IT").format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getTrendBadgeTone = (trend: string): "success" | "critical" | "attention" => {
    switch (trend) {
      case "up":
        return "success";
      case "down":
        return "critical";
      default:
        return "attention";
    }
  };

  const getSegmentBadgeTone = (segment: string): "success" | "info" | "warning" | "critical" => {
    switch (segment.toLowerCase()) {
      case "vip":
        return "success";
      case "clienti fedeli":
        return "success";
      case "clienti regolari":
        return "info";
      case "nuovi clienti":
        return "warning";
      case "clienti a rischio":
        return "critical";
      default:
        return "info";
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "vip":
        return StarIcon;
      case "clienti fedeli":
        return HeartIcon;
      case "clienti regolari":
        return PersonIcon;
      case "nuovi clienti":
        return PersonAddIcon;
      case "clienti a rischio":
        return AlertCircleIcon;
      default:
        return PersonIcon;
    }
  };

  // Customer rows
  const customerRows = data.topCustomers || [];
  const { selectedResources: selectedCustomers, allResourcesSelected: allCustomersSelected, handleSelectionChange: handleCustomerSelectionChange } =
    useIndexResourceState(customerRows.map((c) => ({ id: c.id })));

  // Segment rows
  const segmentRows = data.customerSegments || [];
  const { selectedResources: selectedSegments, allResourcesSelected: allSegmentsSelected, handleSelectionChange: handleSegmentSelectionChange } =
    useIndexResourceState(segmentRows.map((s, i) => ({ id: `seg-${i}` })));

  // Calculate totals
  const totalCustomers = data.customers?.totalCustomers?.value || 0;
  const newCustomers = data.customers?.newCustomers?.value || 0;
  const returningCustomers = data.customers?.returningCustomers?.value || 0;
  const avgLifetimeValue = data.customers?.averageLifetimeValue?.value || 0;
  const acquisitionCost = data.customers?.acquisitionCost?.value || 0;
  const repeatPurchaseRate = data.customers?.repeatPurchaseRate?.value || 0;

  if (loading) {
    return (
      <Page title="Analisi Clienti" backAction={{ content: "Analytics", url: "/analytics" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Analisi Clienti"
      subtitle="Comportamento, segmentazione e valore dei clienti"
      backAction={{ content: "Analytics", url: "/analytics" }}
      primaryAction={{
        content: "Aggiorna",
        icon: RefreshIcon,
        onAction: handleRefresh,
      }}
    >
      <BlockStack gap="600">
        {/* Header with Date Range and Export */}
        <Card>
          <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <DateRangePicker
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              showComparison={true}
              comparisonRange={comparisonRange}
            />
            <DataExport
              dateRange={dateRange}
              availableSections={CUSTOMER_EXPORT_SECTIONS}
              onExport={handleExport}
            />
          </InlineStack>
        </Card>

        {/* Key Customer Metrics */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
          <MetricCard
            title="Clienti Totali"
            value={totalCustomers}
            icon={PersonIcon}
            metric={data.customers?.totalCustomers}
            format="number"
            description="Numero totale di clienti nel database"
          />
          <MetricCard
            title="Nuovi Clienti"
            value={newCustomers}
            icon={PersonAddIcon}
            metric={data.customers?.newCustomers}
            format="number"
            description="Nuovi clienti acquisiti nel periodo"
          />
          <MetricCard
            title="Clienti Ricorrenti"
            value={returningCustomers}
            icon={HeartIcon}
            metric={data.customers?.returningCustomers}
            format="number"
            description="Clienti che hanno effettuato piu' ordini"
          />
        </InlineGrid>

        {/* Secondary Metrics */}
        <InlineGrid columns={{ xs: 2, sm: 3 }} gap="300">
          <MetricCardCompact
            title="LTV Medio"
            value={avgLifetimeValue}
            icon={CashDollarIcon}
            changePercent={data.customers?.averageLifetimeValue?.changePercent}
            trend={data.customers?.averageLifetimeValue?.trend}
            format="currency"
          />
          <MetricCardCompact
            title="Costo Acquisizione"
            value={acquisitionCost}
            icon={CashDollarIcon}
            changePercent={data.customers?.acquisitionCost?.changePercent}
            trend={data.customers?.acquisitionCost?.trend === "down" ? "up" : "down"}
            format="currency"
          />
          <MetricCardCompact
            title="Tasso Riacquisto"
            value={repeatPurchaseRate}
            icon={OrderIcon}
            changePercent={data.customers?.repeatPurchaseRate?.changePercent}
            trend={data.customers?.repeatPurchaseRate?.trend}
            format="percentage"
          />
        </InlineGrid>

        {/* New vs Returning Summary */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Nuovi vs Ricorrenti</Text>
            <Layout>
              <Layout.Section variant="oneHalf">
                <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <Icon source={PersonAddIcon} tone="success" />
                      <Text as="h3" variant="headingSm">Nuovi Clienti</Text>
                    </InlineStack>
                    <Text as="p" variant="heading2xl" fontWeight="bold">
                      {formatNumber(newCustomers)}
                    </Text>
                    <InlineStack gap="200">
                      <ProgressBar
                        progress={(newCustomers / totalCustomers) * 100}
                        size="small"
                        tone="success"
                      />
                      <Text as="span" variant="bodySm">
                        {((newCustomers / totalCustomers) * 100).toFixed(1)}%
                      </Text>
                    </InlineStack>
                    <Badge tone={getTrendBadgeTone(data.customers?.newCustomers?.trend || "neutral")}>
                      {formatPercent(data.customers?.newCustomers?.changePercent || 0)} vs periodo prec.
                    </Badge>
                  </BlockStack>
                </Box>
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <Icon source={HeartIcon} tone="info" />
                      <Text as="h3" variant="headingSm">Clienti Ricorrenti</Text>
                    </InlineStack>
                    <Text as="p" variant="heading2xl" fontWeight="bold">
                      {formatNumber(returningCustomers)}
                    </Text>
                    <InlineStack gap="200">
                      <ProgressBar
                        progress={(returningCustomers / totalCustomers) * 100}
                        size="small"
                        tone="info"
                      />
                      <Text as="span" variant="bodySm">
                        {((returningCustomers / totalCustomers) * 100).toFixed(1)}%
                      </Text>
                    </InlineStack>
                    <Badge tone={getTrendBadgeTone(data.customers?.returningCustomers?.trend || "neutral")}>
                      {formatPercent(data.customers?.returningCustomers?.changePercent || 0)} vs periodo prec.
                    </Badge>
                  </BlockStack>
                </Box>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Card>

        {/* Tabs */}
        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="400">
              {selectedTab === 0 && (
                <BlockStack gap="500">
                  {/* Overview */}
                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <OrdersBarChart
                        title="Trend Nuovi Clienti"
                        subtitle="Acquisizione settimanale"
                        data={customerTrendData}
                        showComparison={true}
                        height={300}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Distribuzione Segmenti"
                        subtitle="Clienti per categoria"
                        data={segmentDonutData}
                        format="number"
                        height={300}
                      />
                    </Layout.Section>
                  </Layout>

                  <HorizontalBarChart
                    title="Revenue per Segmento"
                    subtitle="Contributo al fatturato"
                    data={segmentRevenueData}
                    format="currency"
                    height={280}
                  />
                </BlockStack>
              )}

              {selectedTab === 1 && (
                <BlockStack gap="500">
                  {/* Segments */}
                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Clienti per Segmento"
                        subtitle="Distribuzione"
                        data={segmentDonutData}
                        format="number"
                        height={300}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <HorizontalBarChart
                        title="Revenue per Segmento"
                        subtitle="Valore generato"
                        data={segmentRevenueData}
                        format="currency"
                        height={300}
                      />
                    </Layout.Section>
                  </Layout>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Dettaglio Segmenti</Text>
                      <IndexTable
                        resourceName={{ singular: "segmento", plural: "segmenti" }}
                        itemCount={segmentRows.length}
                        selectedItemsCount={allSegmentsSelected ? "All" : selectedSegments.length}
                        onSelectionChange={handleSegmentSelectionChange}
                        headings={[
                          { title: "Segmento" },
                          { title: "Clienti" },
                          { title: "% Totale" },
                          { title: "AOV" },
                          { title: "Revenue" },
                        ]}
                        selectable={false}
                      >
                        {segmentRows.map((segment, index) => (
                          <IndexTable.Row
                            id={`seg-${index}`}
                            key={index}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <InlineStack gap="200" blockAlign="center">
                                <Icon source={getSegmentIcon(segment.name)} tone="base" />
                                <BlockStack gap="050">
                                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                                    {segment.name}
                                  </Text>
                                  <Text as="span" variant="bodySm" tone="subdued">
                                    {segment.description}
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {formatNumber(segment.count)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Box>
                                <Text as="span" variant="bodyMd">
                                  {segment.percentage.toFixed(1)}%
                                </Text>
                                <Box paddingBlockStart="100">
                                  <ProgressBar progress={segment.percentage} size="small" />
                                </Box>
                              </Box>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {formatCurrency(segment.averageOrderValue)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {formatCurrency(segment.totalRevenue)}
                              </Text>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>
                    </BlockStack>
                  </Card>

                  <Banner tone="info">
                    <p>
                      I clienti VIP rappresentano solo il 7.5% del totale ma generano il 36% del revenue.
                      Concentra gli sforzi di retention su questo segmento.
                    </p>
                  </Banner>
                </BlockStack>
              )}

              {selectedTab === 2 && (
                <BlockStack gap="500">
                  {/* Top Customers */}
                  <Card>
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text as="h2" variant="headingMd">Migliori Clienti per Revenue</Text>
                        <Button variant="plain" onClick={() => router.push("/users")}>
                          Vedi tutti i clienti
                        </Button>
                      </InlineStack>
                      <IndexTable
                        resourceName={{ singular: "cliente", plural: "clienti" }}
                        itemCount={customerRows.length}
                        selectedItemsCount={allCustomersSelected ? "All" : selectedCustomers.length}
                        onSelectionChange={handleCustomerSelectionChange}
                        headings={[
                          { title: "Cliente" },
                          { title: "Ordini" },
                          { title: "Totale Speso" },
                          { title: "Ultimo Ordine" },
                          { title: "Segmento" },
                          { title: "Cliente dal" },
                        ]}
                        selectable={false}
                      >
                        {customerRows.map((customer, index) => (
                          <IndexTable.Row
                            id={customer.id}
                            key={customer.id}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <InlineStack gap="300" blockAlign="center">
                                <Avatar customer size="sm" name={customer.name} />
                                <BlockStack gap="050">
                                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                                    {customer.name}
                                  </Text>
                                  <Text as="span" variant="bodySm" tone="subdued">
                                    {customer.email}
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {customer.totalOrders}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {formatCurrency(customer.totalSpent)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {new Date(customer.lastOrderDate).toLocaleDateString("it-IT")}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Badge tone={getSegmentBadgeTone(customer.segment)}>
                                {customer.segment.toUpperCase()}
                              </Badge>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd" tone="subdued">
                                {new Date(customer.customerSince).toLocaleDateString("it-IT")}
                              </Text>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>
                    </BlockStack>
                  </Card>
                </BlockStack>
              )}

              {selectedTab === 3 && (
                <BlockStack gap="500">
                  {/* Lifetime Value */}
                  <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">LTV Medio</Text>
                        <Text as="p" variant="heading2xl" fontWeight="bold">
                          {formatCurrency(avgLifetimeValue)}
                        </Text>
                        <Badge tone={getTrendBadgeTone(data.customers?.averageLifetimeValue?.trend || "neutral")}>
                          {formatPercent(data.customers?.averageLifetimeValue?.changePercent || 0)}
                        </Badge>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Rapporto LTV/CAC</Text>
                        <Text as="p" variant="heading2xl" fontWeight="bold">
                          {(avgLifetimeValue / acquisitionCost).toFixed(1)}x
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          Obiettivo: 3x o superiore
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Ordini Medi per Cliente</Text>
                        <Text as="p" variant="heading2xl" fontWeight="bold">
                          {((data.orders?.totalOrders?.value || 0) / totalCustomers).toFixed(1)}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          Nel periodo selezionato
                        </Text>
                      </BlockStack>
                    </Card>
                  </InlineGrid>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">LTV per Segmento</Text>
                      <BlockStack gap="300">
                        {segmentRows.map((segment, index) => {
                          const segmentLTV = segment.totalRevenue / segment.count;
                          const percentOfAvg = (segmentLTV / avgLifetimeValue) * 100;
                          return (
                            <div key={index}>
                              <InlineStack align="space-between" blockAlign="center">
                                <InlineStack gap="200" blockAlign="center">
                                  <Icon source={getSegmentIcon(segment.name)} tone="base" />
                                  <Text as="span" variant="bodyMd" fontWeight="medium">
                                    {segment.name}
                                  </Text>
                                </InlineStack>
                                <BlockStack gap="100" align="end">
                                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                                    {formatCurrency(segmentLTV)}
                                  </Text>
                                  <Text as="span" variant="bodySm" tone="subdued">
                                    {percentOfAvg.toFixed(0)}% della media
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                              <Box paddingBlockStart="200">
                                <ProgressBar progress={Math.min(percentOfAvg, 100)} size="small" />
                              </Box>
                              {index < segmentRows.length - 1 && (
                                <Box paddingBlockStart="300">
                                  <Divider />
                                </Box>
                              )}
                            </div>
                          );
                        })}
                      </BlockStack>
                    </BlockStack>
                  </Card>

                  <Banner tone="success">
                    <p>
                      Il rapporto LTV/CAC di {(avgLifetimeValue / acquisitionCost).toFixed(1)}x indica
                      un'eccellente efficienza nell'acquisizione clienti. Continua a investire nei canali attuali.
                    </p>
                  </Banner>
                </BlockStack>
              )}

              {selectedTab === 4 && (
                <BlockStack gap="500">
                  {/* Acquisition */}
                  <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Costo Acquisizione (CAC)</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(acquisitionCost)}
                        </Text>
                        <Badge tone={getTrendBadgeTone(data.customers?.acquisitionCost?.trend === "down" ? "up" : "down")}>
                          {formatPercent(data.customers?.acquisitionCost?.changePercent || 0)}
                        </Badge>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Nuovi Clienti</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatNumber(newCustomers)}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          Nel periodo
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Spesa Marketing</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(acquisitionCost * newCustomers)}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          Stimata
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Tasso Riacquisto</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {repeatPurchaseRate.toFixed(1)}%
                        </Text>
                        <Badge tone={getTrendBadgeTone(data.customers?.repeatPurchaseRate?.trend || "neutral")}>
                          {formatPercent(data.customers?.repeatPurchaseRate?.changePercent || 0)}
                        </Badge>
                      </BlockStack>
                    </Card>
                  </InlineGrid>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Acquisizione per Canale</Text>
                      <BlockStack gap="300">
                        {(data.trafficSources || []).slice(0, 5).map((source, index) => {
                          const estimatedNewCustomers = Math.round((source.orders / (data.orders?.totalOrders?.value || 1)) * newCustomers);
                          const estimatedCAC = estimatedNewCustomers > 0 ? (acquisitionCost * newCustomers * (source.percentage / 100)) / estimatedNewCustomers : 0;
                          return (
                            <div key={index}>
                              <InlineStack align="space-between" blockAlign="center">
                                <BlockStack gap="100">
                                  <Text as="span" variant="bodyMd" fontWeight="medium">
                                    {source.source}
                                  </Text>
                                  <Text as="span" variant="bodySm" tone="subdued">
                                    ~{estimatedNewCustomers} nuovi clienti ({source.percentage}%)
                                  </Text>
                                </BlockStack>
                                <BlockStack gap="100" align="end">
                                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                                    CAC: {formatCurrency(estimatedCAC)}
                                  </Text>
                                  <Text as="span" variant="bodySm" tone="subdued">
                                    Conv: {source.conversionRate}%
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                              <Box paddingBlockStart="200">
                                <ProgressBar progress={source.percentage} size="small" />
                              </Box>
                              {index < (data.trafficSources?.length || 0) - 1 && (
                                <Box paddingBlockStart="300">
                                  <Divider />
                                </Box>
                              )}
                            </div>
                          );
                        })}
                      </BlockStack>
                    </BlockStack>
                  </Card>

                  <Banner tone="info">
                    <p>
                      L'Email Marketing ha il miglior tasso di conversione (5.72%) e il CAC piu' basso.
                      Considera di aumentare gli investimenti su questo canale.
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
            <Button onClick={() => router.push("/analytics/report")}>
              Report
            </Button>
          </InlineStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
