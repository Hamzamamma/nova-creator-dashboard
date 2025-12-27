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
  Banner,
  Tooltip,
} from "@shopify/polaris";
import {
  CashDollarIcon,
  OrderIcon,
  ChartVerticalIcon,
  DiscountIcon,
  ReturnIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  HashtagIcon,
  ProductIcon,
  StoreIcon,
} from "@shopify/polaris-icons";

import { MetricCard, MetricCardCompact } from "../components/MetricCard";
import {
  RevenueChart,
  OrdersBarChart,
  DonutChart,
  HorizontalBarChart,
  MultiLineChart,
} from "../components/SimpleChart";
import { DateRangePicker, useDateRange } from "../components/DateRangePicker";
import { DataExport, SALES_EXPORT_SECTIONS } from "../components/DataExport";

import analyticsData from "../data.json";
import type {
  AnalyticsData,
  SalesByCategory,
  SalesByChannel,
} from "../types";

const data = analyticsData as unknown as AnalyticsData;

export default function VenditePage() {
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
    { id: "categories", content: "Categorie", accessibilityLabel: "Categorie" },
    { id: "channels", content: "Canali", accessibilityLabel: "Canali" },
    { id: "discounts", content: "Sconti", accessibilityLabel: "Sconti" },
    { id: "returns", content: "Rimborsi", accessibilityLabel: "Rimborsi" },
  ];

  // Chart data
  const revenueChartData = useMemo(() => {
    return data.revenueChart?.daily?.slice(-14) || [];
  }, []);

  const categoryDonutData = useMemo(() => {
    return (data.salesByCategory || []).map((cat) => ({
      name: cat.category,
      value: cat.revenue,
      percentage: cat.percentage,
    }));
  }, []);

  const channelDonutData = useMemo(() => {
    return (data.salesByChannel || []).map((ch) => ({
      name: ch.channel,
      value: ch.revenue,
      percentage: ch.percentage,
    }));
  }, []);

  const categoryBarData = useMemo(() => {
    return (data.salesByCategory || []).map((cat) => ({
      name: cat.category,
      value: cat.sales,
    }));
  }, []);

  const channelBarData = useMemo(() => {
    return (data.salesByChannel || []).map((ch) => ({
      name: ch.channel,
      value: ch.orders,
    }));
  }, []);

  // Gross vs Net comparison data
  const grossNetData = useMemo(() => {
    return [
      { label: "Lordo", gross: data.revenue?.grossProfit?.value || 0, net: 0 },
      { label: "Netto", gross: 0, net: data.revenue?.netProfit?.value || 0 },
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

  const getGrowthTone = (growth: number): "success" | "critical" | "attention" => {
    if (growth > 0) return "success";
    if (growth < 0) return "critical";
    return "attention";
  };

  // Calculate totals
  const totalGross = data.revenue?.grossProfit?.value || 0;
  const totalNet = data.revenue?.netProfit?.value || 0;
  const totalDiscounts = data.discountImpact?.totalDiscounts || 0;
  const totalRefunds = data.refundAnalysis?.totalRefunds || 0;

  // Category rows for IndexTable
  const categoryRows = data.salesByCategory || [];
  const { selectedResources: selectedCategories, allResourcesSelected: allCategoriesSelected, handleSelectionChange: handleCategorySelectionChange } =
    useIndexResourceState(categoryRows.map((c, i) => ({ id: `cat-${i}` })));

  // Channel rows for IndexTable
  const channelRows = data.salesByChannel || [];
  const { selectedResources: selectedChannels, allResourcesSelected: allChannelsSelected, handleSelectionChange: handleChannelSelectionChange } =
    useIndexResourceState(channelRows.map((c, i) => ({ id: `ch-${i}` })));

  // Refund reasons rows
  const refundReasons = data.refundAnalysis?.topRefundReasons || [];
  const { selectedResources: selectedRefunds, allResourcesSelected: allRefundsSelected, handleSelectionChange: handleRefundSelectionChange } =
    useIndexResourceState(refundReasons.map((r, i) => ({ id: `ref-${i}` })));

  if (loading) {
    return (
      <Page title="Analisi Vendite" backAction={{ content: "Analytics", url: "/analytics" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Analisi Vendite"
      subtitle="Dettaglio completo delle vendite e performance"
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
              availableSections={SALES_EXPORT_SECTIONS}
              onExport={handleExport}
            />
          </InlineStack>
        </Card>

        {/* Key Sales Metrics */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
          <MetricCard
            title="Vendite Lorde"
            value={totalGross}
            icon={CashDollarIcon}
            metric={data.revenue?.grossProfit}
            format="currency"
            description="Totale vendite prima di sconti e rimborsi"
          />
          <MetricCard
            title="Vendite Nette"
            value={totalNet}
            icon={CashDollarIcon}
            metric={data.revenue?.netProfit}
            format="currency"
            description="Vendite al netto di sconti e rimborsi"
          />
          <MetricCard
            title="Sconti Applicati"
            value={totalDiscounts}
            icon={DiscountIcon}
            format="currency"
            description="Totale sconti concessi"
            showTrend={false}
          />
          <MetricCard
            title="Rimborsi"
            value={totalRefunds}
            icon={ReturnIcon}
            format="currency"
            description="Totale rimborsi erogati"
            showTrend={false}
          />
        </InlineGrid>

        {/* Gross vs Net Summary */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Riepilogo Vendite</Text>
            <InlineGrid columns={3} gap="400">
              <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="200" align="center">
                  <Text as="span" variant="bodySm" tone="subdued">Vendite Lorde</Text>
                  <Text as="p" variant="headingXl" fontWeight="bold">
                    {formatCurrency(totalGross)}
                  </Text>
                </BlockStack>
              </Box>
              <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="200" align="center">
                  <Text as="span" variant="bodySm" tone="subdued">Deduzioni</Text>
                  <Text as="p" variant="headingXl" fontWeight="bold" tone="critical">
                    -{formatCurrency(totalDiscounts + totalRefunds)}
                  </Text>
                  <InlineStack gap="200">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Sconti: {formatCurrency(totalDiscounts)}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      Rimborsi: {formatCurrency(totalRefunds)}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Box>
              <Box padding="400" background="bg-surface-success" borderRadius="200">
                <BlockStack gap="200" align="center">
                  <Text as="span" variant="bodySm">Vendite Nette</Text>
                  <Text as="p" variant="headingXl" fontWeight="bold">
                    {formatCurrency(totalNet)}
                  </Text>
                  <Badge tone="success">
                    Margine: {((totalNet / totalGross) * 100).toFixed(1)}%
                  </Badge>
                </BlockStack>
              </Box>
            </InlineGrid>
          </BlockStack>
        </Card>

        {/* Tabs */}
        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="400">
              {selectedTab === 0 && (
                <BlockStack gap="500">
                  {/* Overview */}
                  <RevenueChart
                    title="Andamento Vendite"
                    subtitle="Ultimi 14 giorni"
                    data={revenueChartData}
                    showComparison={true}
                    format="currency"
                    height={350}
                  />

                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Vendite per Categoria"
                        subtitle="Distribuzione revenue"
                        data={categoryDonutData}
                        format="currency"
                        height={300}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Vendite per Canale"
                        subtitle="Distribuzione ordini"
                        data={channelDonutData}
                        format="currency"
                        height={300}
                      />
                    </Layout.Section>
                  </Layout>
                </BlockStack>
              )}

              {selectedTab === 1 && (
                <BlockStack gap="500">
                  {/* Categories */}
                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <HorizontalBarChart
                        title="Vendite per Categoria"
                        subtitle="Numero di vendite"
                        data={categoryBarData}
                        format="number"
                        height={300}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Revenue per Categoria"
                        subtitle="Distribuzione percentuale"
                        data={categoryDonutData}
                        format="currency"
                        height={300}
                      />
                    </Layout.Section>
                  </Layout>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Dettaglio Categorie</Text>
                      <IndexTable
                        resourceName={{ singular: "categoria", plural: "categorie" }}
                        itemCount={categoryRows.length}
                        selectedItemsCount={allCategoriesSelected ? "All" : selectedCategories.length}
                        onSelectionChange={handleCategorySelectionChange}
                        headings={[
                          { title: "Categoria" },
                          { title: "Vendite" },
                          { title: "Revenue" },
                          { title: "Quota %" },
                          { title: "Crescita" },
                        ]}
                        selectable={false}
                      >
                        {categoryRows.map((category, index) => (
                          <IndexTable.Row
                            id={`cat-${index}`}
                            key={index}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <InlineStack gap="200" blockAlign="center">
                                <Icon source={ProductIcon} tone="base" />
                                <Text as="span" variant="bodyMd" fontWeight="semibold">
                                  {category.category}
                                </Text>
                              </InlineStack>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {formatNumber(category.sales)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {formatCurrency(category.revenue)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Box>
                                <InlineStack gap="200" blockAlign="center">
                                  <Text as="span" variant="bodyMd">
                                    {category.percentage.toFixed(1)}%
                                  </Text>
                                </InlineStack>
                                <Box paddingBlockStart="100">
                                  <ProgressBar progress={category.percentage} size="small" />
                                </Box>
                              </Box>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Badge tone={getGrowthTone(category.growth)}>
                                <InlineStack gap="100" blockAlign="center">
                                  <Icon source={category.growth >= 0 ? ArrowUpIcon : ArrowDownIcon} />
                                  <span>{formatPercent(category.growth)}</span>
                                </InlineStack>
                              </Badge>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>
                    </BlockStack>
                  </Card>
                </BlockStack>
              )}

              {selectedTab === 2 && (
                <BlockStack gap="500">
                  {/* Channels */}
                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <HorizontalBarChart
                        title="Ordini per Canale"
                        subtitle="Distribuzione ordini"
                        data={channelBarData}
                        format="number"
                        height={280}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Revenue per Canale"
                        subtitle="Distribuzione vendite"
                        data={channelDonutData}
                        format="currency"
                        height={280}
                      />
                    </Layout.Section>
                  </Layout>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Performance Canali</Text>
                      <IndexTable
                        resourceName={{ singular: "canale", plural: "canali" }}
                        itemCount={channelRows.length}
                        selectedItemsCount={allChannelsSelected ? "All" : selectedChannels.length}
                        onSelectionChange={handleChannelSelectionChange}
                        headings={[
                          { title: "Canale" },
                          { title: "Ordini" },
                          { title: "Revenue" },
                          { title: "Quota %" },
                          { title: "Crescita" },
                        ]}
                        selectable={false}
                      >
                        {channelRows.map((channel, index) => (
                          <IndexTable.Row
                            id={`ch-${index}`}
                            key={index}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <InlineStack gap="200" blockAlign="center">
                                <Icon source={StoreIcon} tone="base" />
                                <Text as="span" variant="bodyMd" fontWeight="semibold">
                                  {channel.channel}
                                </Text>
                              </InlineStack>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd">
                                {formatNumber(channel.orders)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {formatCurrency(channel.revenue)}
                              </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Box>
                                <Text as="span" variant="bodyMd">
                                  {channel.percentage.toFixed(1)}%
                                </Text>
                                <Box paddingBlockStart="100">
                                  <ProgressBar progress={channel.percentage} size="small" />
                                </Box>
                              </Box>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                              <Badge tone={getGrowthTone(channel.growth)}>
                                <InlineStack gap="100" blockAlign="center">
                                  <Icon source={channel.growth >= 0 ? ArrowUpIcon : ArrowDownIcon} />
                                  <span>{formatPercent(channel.growth)}</span>
                                </InlineStack>
                              </Badge>
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
                  {/* Discounts */}
                  <Banner tone="info">
                    <p>
                      Nel periodo selezionato, il {data.discountImpact?.discountPercentage?.toFixed(1)}% degli ordini
                      ha utilizzato un codice sconto, con un impatto sul revenue del {data.discountImpact?.revenueImpact?.toFixed(1)}%.
                    </p>
                  </Banner>

                  <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Totale Sconti</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(data.discountImpact?.totalDiscounts || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Ordini con Sconto</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatNumber(data.discountImpact?.ordersWithDiscount || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Sconto Medio</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(data.discountImpact?.averageDiscount || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">% Ordini Scontati</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {data.discountImpact?.discountPercentage?.toFixed(1)}%
                        </Text>
                      </BlockStack>
                    </Card>
                  </InlineGrid>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Impatto sul Revenue</Text>
                      <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text as="span" variant="bodySm" tone="subdued">
                              Senza sconti avresti guadagnato
                            </Text>
                            <Text as="p" variant="headingLg">
                              {formatCurrency((data.revenue?.totalRevenue?.value || 0) + (data.discountImpact?.totalDiscounts || 0))}
                            </Text>
                          </BlockStack>
                          <BlockStack gap="100" align="end">
                            <Text as="span" variant="bodySm" tone="subdued">
                              Impatto sconti
                            </Text>
                            <Badge tone="critical">
                              {data.discountImpact?.revenueImpact?.toFixed(1)}%
                            </Badge>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    </BlockStack>
                  </Card>
                </BlockStack>
              )}

              {selectedTab === 4 && (
                <BlockStack gap="500">
                  {/* Returns/Refunds */}
                  <Banner tone="warning">
                    <p>
                      Il tasso di rimborso attuale e' del {data.refundAnalysis?.refundRate?.toFixed(2)}%,
                      con un rimborso medio di {formatCurrency(data.refundAnalysis?.averageRefundAmount || 0)}.
                    </p>
                  </Banner>

                  <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Totale Rimborsi</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(data.refundAnalysis?.totalRefunds || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">N. Rimborsi</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatNumber(data.refundAnalysis?.refundCount || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Rimborso Medio</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {formatCurrency(data.refundAnalysis?.averageRefundAmount || 0)}
                        </Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h3" variant="bodySm" tone="subdued">Tasso Rimborso</Text>
                        <Text as="p" variant="headingXl" fontWeight="bold">
                          {data.refundAnalysis?.refundRate?.toFixed(2)}%
                        </Text>
                      </BlockStack>
                    </Card>
                  </InlineGrid>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Motivi dei Rimborsi</Text>
                      <IndexTable
                        resourceName={{ singular: "motivo", plural: "motivi" }}
                        itemCount={refundReasons.length}
                        selectedItemsCount={allRefundsSelected ? "All" : selectedRefunds.length}
                        onSelectionChange={handleRefundSelectionChange}
                        headings={[
                          { title: "Motivo" },
                          { title: "Numero" },
                          { title: "Importo" },
                          { title: "% sul Totale" },
                        ]}
                        selectable={false}
                      >
                        {refundReasons.map((reason, index) => {
                          const percentage = ((reason.amount / (data.refundAnalysis?.totalRefunds || 1)) * 100);
                          return (
                            <IndexTable.Row
                              id={`ref-${index}`}
                              key={index}
                              position={index}
                            >
                              <IndexTable.Cell>
                                <Text as="span" variant="bodyMd" fontWeight="semibold">
                                  {reason.reason}
                                </Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text as="span" variant="bodyMd">
                                  {reason.count}
                                </Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text as="span" variant="bodyMd" fontWeight="semibold">
                                  {formatCurrency(reason.amount)}
                                </Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Box>
                                  <Text as="span" variant="bodyMd">
                                    {percentage.toFixed(1)}%
                                  </Text>
                                  <Box paddingBlockStart="100">
                                    <ProgressBar progress={percentage} size="small" tone="critical" />
                                  </Box>
                                </Box>
                              </IndexTable.Cell>
                            </IndexTable.Row>
                          );
                        })}
                      </IndexTable>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Suggerimenti</Text>
                      <BlockStack gap="200">
                        <InlineStack gap="200" blockAlign="start">
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#008060", marginTop: "6px" }} />
                          <Text as="p" variant="bodyMd">
                            La "Taglia sbagliata" e' il motivo principale di rimborso. Considera di migliorare la guida taglie.
                          </Text>
                        </InlineStack>
                        <InlineStack gap="200" blockAlign="start">
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#008060", marginTop: "6px" }} />
                          <Text as="p" variant="bodyMd">
                            I prodotti difettosi rappresentano il 28% dei rimborsi. Verifica la qualita' dei fornitori.
                          </Text>
                        </InlineStack>
                        <InlineStack gap="200" blockAlign="start">
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#008060", marginTop: "6px" }} />
                          <Text as="p" variant="bodyMd">
                            Aggiorna le descrizioni prodotto per ridurre i resi "non conforme alla descrizione".
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </BlockStack>
                  </Card>
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
            <Button onClick={() => router.push("/analytics/clienti")}>
              Analisi Clienti
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
