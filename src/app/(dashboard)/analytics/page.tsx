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
  Collapsible,
  IndexTable,
  useIndexResourceState,
  Avatar,
  Tooltip,
  ProgressBar,
} from "@shopify/polaris";
import {
  CashDollarIcon,
  OrderIcon,
  ChartVerticalIcon,
  PersonIcon,
  CartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  EyeCheckMarkIcon,
  ProductIcon,
  LocationIcon,
  HashtagIcon,
  TargetIcon,
} from "@shopify/polaris-icons";

import { MetricCard, MetricCardCompact } from "./components/MetricCard";
import {
  RevenueChart,
  OrdersBarChart,
  DonutChart,
  HorizontalBarChart,
} from "./components/SimpleChart";
import { DateRangePicker, useDateRange } from "./components/DateRangePicker";
import { DataExport, ANALYTICS_EXPORT_SECTIONS } from "./components/DataExport";

import analyticsData from "./data.json";
import type {
  AnalyticsData,
  TopProduct,
  TopCustomer,
  TrafficSource,
  SalesByLocation,
} from "./types";

// Type assertion for the imported JSON data
const data = analyticsData as unknown as AnalyticsData;

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showComparison, setShowComparison] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    topProducts: true,
    topCustomers: true,
    trafficSources: true,
    salesByLocation: true,
  });

  const {
    dateRange,
    setDateRange,
    currentPreset,
    setPreset,
    comparisonRange,
  } = useDateRange("last30days");

  // Products table selection
  const productRows = data.topProducts || [];
  const { selectedResources: selectedProducts, allResourcesSelected: allProductsSelected, handleSelectionChange: handleProductSelectionChange } =
    useIndexResourceState(productRows.map((p) => ({ id: p.id })));

  // Customers table selection
  const customerRows = data.topCustomers || [];
  const { selectedResources: selectedCustomers, allResourcesSelected: allCustomersSelected, handleSelectionChange: handleCustomerSelectionChange } =
    useIndexResourceState(customerRows.map((c) => ({ id: c.id })));

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleExport = useCallback(async () => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Export completed");
  }, []);

  const tabs = [
    { id: "overview", content: "Panoramica", accessibilityLabel: "Panoramica" },
    { id: "revenue", content: "Revenue", accessibilityLabel: "Revenue" },
    { id: "orders", content: "Ordini", accessibilityLabel: "Ordini" },
    { id: "products", content: "Prodotti", accessibilityLabel: "Prodotti" },
  ];

  // Chart data preparation
  const revenueChartData = useMemo(() => {
    return data.revenueChart?.daily?.slice(-14) || [];
  }, []);

  const ordersChartData = useMemo(() => {
    return data.ordersChart?.daily?.slice(-14) || [];
  }, []);

  // Traffic sources for donut chart
  const trafficDonutData = useMemo(() => {
    return (data.trafficSources || []).map((source) => ({
      name: source.source,
      value: source.revenue,
      percentage: source.percentage,
    }));
  }, []);

  // Location data for horizontal bar chart
  const locationBarData = useMemo(() => {
    return (data.salesByLocation || []).slice(0, 6).map((loc) => ({
      name: loc.region,
      value: loc.revenue,
    }));
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

  const getSegmentBadgeTone = (segment: string): "success" | "info" | "warning" | "critical" => {
    switch (segment) {
      case "vip":
        return "success";
      case "regular":
        return "info";
      case "new":
        return "warning";
      case "at-risk":
        return "critical";
      default:
        return "info";
    }
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

  if (loading) {
    return (
      <Page title="Analytics">
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Analytics"
      subtitle="Panoramica completa delle performance del tuo negozio"
      primaryAction={{
        content: "Aggiorna",
        icon: RefreshIcon,
        onAction: handleRefresh,
      }}
      secondaryActions={[
        {
          content: "Vendite",
          onAction: () => router.push("/analytics/vendite"),
        },
        {
          content: "Clienti",
          onAction: () => router.push("/analytics/clienti"),
        },
        {
          content: "Report",
          onAction: () => router.push("/analytics/report"),
        },
      ]}
    >
      <BlockStack gap="600">
        {/* Header with Date Range and Export */}
        <Card>
          <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <InlineStack gap="400" blockAlign="center">
              <DateRangePicker
                selectedRange={dateRange}
                onRangeChange={setDateRange}
                showComparison={showComparison}
                comparisonRange={comparisonRange}
              />
              <Button
                pressed={showComparison}
                onClick={() => setShowComparison(!showComparison)}
                size="slim"
              >
                Confronta periodo
              </Button>
            </InlineStack>
            <DataExport
              dateRange={dateRange}
              availableSections={ANALYTICS_EXPORT_SECTIONS}
              onExport={handleExport}
            />
          </InlineStack>
        </Card>

        {/* Key Metrics Grid */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
          <MetricCard
            title="Revenue Totale"
            value={data.revenue?.totalRevenue?.value || 0}
            icon={CashDollarIcon}
            metric={data.revenue?.totalRevenue}
            format="currency"
            description="Ricavi totali nel periodo selezionato"
          />
          <MetricCard
            title="Ordini"
            value={data.orders?.totalOrders?.value || 0}
            icon={OrderIcon}
            metric={data.orders?.totalOrders}
            format="number"
            description="Numero totale di ordini ricevuti"
          />
          <MetricCard
            title="Valore Medio Ordine"
            value={data.revenue?.averageOrderValue?.value || 0}
            icon={CartIcon}
            metric={data.revenue?.averageOrderValue}
            format="currency"
            description="Spesa media per ordine"
          />
          <MetricCard
            title="Tasso Conversione"
            value={data.conversion?.conversionRate?.value || 0}
            icon={TargetIcon}
            metric={data.conversion?.conversionRate}
            format="percentage"
            description="Percentuale visitatori che acquistano"
          />
        </InlineGrid>

        {/* Secondary Metrics Row */}
        <InlineGrid columns={{ xs: 2, sm: 4 }} gap="300">
          <MetricCardCompact
            title="Nuovi Clienti"
            value={data.customers?.newCustomers?.value || 0}
            icon={PersonIcon}
            changePercent={data.customers?.newCustomers?.changePercent}
            trend={data.customers?.newCustomers?.trend}
          />
          <MetricCardCompact
            title="Ordini Completati"
            value={data.orders?.completedOrders?.value || 0}
            icon={OrderIcon}
            changePercent={data.orders?.completedOrders?.changePercent}
            trend={data.orders?.completedOrders?.trend}
          />
          <MetricCardCompact
            title="Profitto Netto"
            value={data.revenue?.netProfit?.value || 0}
            icon={CashDollarIcon}
            changePercent={data.revenue?.netProfit?.changePercent}
            trend={data.revenue?.netProfit?.trend}
            format="currency"
          />
          <MetricCardCompact
            title="Abbandono Carrello"
            value={data.conversion?.cartAbandonmentRate?.value || 0}
            icon={CartIcon}
            changePercent={data.conversion?.cartAbandonmentRate?.changePercent}
            trend={data.conversion?.cartAbandonmentRate?.trend === "down" ? "up" : "down"}
            format="percentage"
          />
        </InlineGrid>

        {/* Tabs for different views */}
        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="400">
              {selectedTab === 0 && (
                <BlockStack gap="500">
                  {/* Overview Tab Content */}
                  <Layout>
                    <Layout.Section>
                      <RevenueChart
                        title="Andamento Revenue"
                        subtitle="Ultimi 14 giorni"
                        data={revenueChartData}
                        showComparison={showComparison}
                        format="currency"
                        height={320}
                      />
                    </Layout.Section>
                  </Layout>

                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <OrdersBarChart
                        title="Ordini Giornalieri"
                        subtitle="Numero ordini per giorno"
                        data={ordersChartData}
                        showComparison={showComparison}
                        height={280}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <DonutChart
                        title="Revenue per Sorgente"
                        subtitle="Distribuzione traffico"
                        data={trafficDonutData}
                        format="currency"
                        height={280}
                      />
                    </Layout.Section>
                  </Layout>
                </BlockStack>
              )}

              {selectedTab === 1 && (
                <BlockStack gap="500">
                  {/* Revenue Tab */}
                  <RevenueChart
                    title="Dettaglio Revenue"
                    subtitle="Analisi giornaliera delle vendite"
                    data={revenueChartData}
                    showComparison={showComparison}
                    format="currency"
                    height={400}
                  />

                  <Layout>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h3" variant="headingSm">Revenue Lordo</Text>
                          <Text as="p" variant="heading2xl" fontWeight="bold">
                            {formatCurrency(data.revenue?.grossProfit?.value || 0)}
                          </Text>
                          <Badge tone={getTrendBadgeTone(data.revenue?.grossProfit?.trend || "neutral")}>
                            {formatPercent(data.revenue?.grossProfit?.changePercent || 0)}
                          </Badge>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h3" variant="headingSm">Revenue Netto</Text>
                          <Text as="p" variant="heading2xl" fontWeight="bold">
                            {formatCurrency(data.revenue?.netProfit?.value || 0)}
                          </Text>
                          <Badge tone={getTrendBadgeTone(data.revenue?.netProfit?.trend || "neutral")}>
                            {formatPercent(data.revenue?.netProfit?.changePercent || 0)}
                          </Badge>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h3" variant="headingSm">AOV</Text>
                          <Text as="p" variant="heading2xl" fontWeight="bold">
                            {formatCurrency(data.revenue?.averageOrderValue?.value || 0)}
                          </Text>
                          <Badge tone={getTrendBadgeTone(data.revenue?.averageOrderValue?.trend || "neutral")}>
                            {formatPercent(data.revenue?.averageOrderValue?.changePercent || 0)}
                          </Badge>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                  </Layout>
                </BlockStack>
              )}

              {selectedTab === 2 && (
                <BlockStack gap="500">
                  {/* Orders Tab */}
                  <OrdersBarChart
                    title="Ordini nel Tempo"
                    subtitle="Trend ordini giornalieri"
                    data={ordersChartData}
                    showComparison={showComparison}
                    height={400}
                  />

                  <InlineGrid columns={4} gap="300">
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h4" variant="bodySm" tone="subdued">Totali</Text>
                        <Text as="p" variant="headingLg">{formatNumber(data.orders?.totalOrders?.value || 0)}</Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h4" variant="bodySm" tone="subdued">Completati</Text>
                        <Text as="p" variant="headingLg">{formatNumber(data.orders?.completedOrders?.value || 0)}</Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h4" variant="bodySm" tone="subdued">In Attesa</Text>
                        <Text as="p" variant="headingLg">{formatNumber(data.orders?.pendingOrders?.value || 0)}</Text>
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h4" variant="bodySm" tone="subdued">Annullati</Text>
                        <Text as="p" variant="headingLg">{formatNumber(data.orders?.cancelledOrders?.value || 0)}</Text>
                      </BlockStack>
                    </Card>
                  </InlineGrid>
                </BlockStack>
              )}

              {selectedTab === 3 && (
                <BlockStack gap="500">
                  {/* Products Tab */}
                  <HorizontalBarChart
                    title="Top Prodotti per Revenue"
                    subtitle="Prodotti con maggiori vendite"
                    data={productRows.slice(0, 8).map((p) => ({
                      name: p.name.length > 25 ? p.name.substring(0, 25) + "..." : p.name,
                      value: p.revenue,
                    }))}
                    format="currency"
                    height={350}
                  />
                </BlockStack>
              )}
            </Box>
          </Tabs>
        </Card>

        {/* Top Products Section */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={ProductIcon} tone="base" />
                <Text as="h2" variant="headingMd">Top Prodotti</Text>
              </InlineStack>
              <InlineStack gap="200">
                <Button
                  size="slim"
                  onClick={() => toggleSection("topProducts")}
                  ariaExpanded={expandedSections.topProducts}
                  ariaControls="top-products-section"
                >
                  {expandedSections.topProducts ? "Nascondi" : "Mostra"}
                </Button>
                <Button
                  size="slim"
                  variant="plain"
                  onClick={() => router.push("/analytics/vendite")}
                >
                  Vedi tutti
                </Button>
              </InlineStack>
            </InlineStack>

            <Collapsible
              open={expandedSections.topProducts}
              id="top-products-section"
            >
              <IndexTable
                resourceName={{ singular: "prodotto", plural: "prodotti" }}
                itemCount={productRows.length}
                selectedItemsCount={allProductsSelected ? "All" : selectedProducts.length}
                onSelectionChange={handleProductSelectionChange}
                headings={[
                  { title: "Prodotto" },
                  { title: "Categoria" },
                  { title: "Vendite" },
                  { title: "Revenue" },
                  { title: "Trend" },
                ]}
                selectable={false}
              >
                {productRows.slice(0, 5).map((product, index) => (
                  <IndexTable.Row
                    id={product.id}
                    key={product.id}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <InlineStack gap="300" blockAlign="center">
                        <Text as="span" variant="bodyMd" fontWeight="semibold">
                          {index + 1}.
                        </Text>
                        <Text as="span" variant="bodyMd">
                          {product.name}
                        </Text>
                      </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Badge>{product.category}</Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span" variant="bodyMd">
                        {formatNumber(product.salesCount)}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {formatCurrency(product.revenue)}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Badge tone={getTrendBadgeTone(product.trend)}>
                        <InlineStack gap="100" blockAlign="center">
                          <Icon source={product.trend === "up" ? ArrowUpIcon : product.trend === "down" ? ArrowDownIcon : ArrowUpIcon} />
                          <span>{formatPercent(product.changePercent)}</span>
                        </InlineStack>
                      </Badge>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            </Collapsible>
          </BlockStack>
        </Card>

        {/* Top Customers Section */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={PersonIcon} tone="base" />
                <Text as="h2" variant="headingMd">Top Clienti</Text>
              </InlineStack>
              <InlineStack gap="200">
                <Button
                  size="slim"
                  onClick={() => toggleSection("topCustomers")}
                  ariaExpanded={expandedSections.topCustomers}
                  ariaControls="top-customers-section"
                >
                  {expandedSections.topCustomers ? "Nascondi" : "Mostra"}
                </Button>
                <Button
                  size="slim"
                  variant="plain"
                  onClick={() => router.push("/analytics/clienti")}
                >
                  Vedi tutti
                </Button>
              </InlineStack>
            </InlineStack>

            <Collapsible
              open={expandedSections.topCustomers}
              id="top-customers-section"
            >
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
                ]}
                selectable={false}
              >
                {customerRows.slice(0, 5).map((customer, index) => (
                  <IndexTable.Row
                    id={customer.id}
                    key={customer.id}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <InlineStack gap="300" blockAlign="center">
                        <Avatar
                          customer
                          size="sm"
                          name={customer.name}
                        />
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
                  </IndexTable.Row>
                ))}
              </IndexTable>
            </Collapsible>
          </BlockStack>
        </Card>

        {/* Traffic Sources & Location Grid */}
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={HashtagIcon} tone="base" />
                    <Text as="h2" variant="headingMd">Sorgenti Traffico</Text>
                  </InlineStack>
                  <Button
                    size="slim"
                    onClick={() => toggleSection("trafficSources")}
                    ariaExpanded={expandedSections.trafficSources}
                    ariaControls="traffic-sources-section"
                  >
                    {expandedSections.trafficSources ? "Nascondi" : "Mostra"}
                  </Button>
                </InlineStack>

                <Collapsible
                  open={expandedSections.trafficSources}
                  id="traffic-sources-section"
                >
                  <BlockStack gap="300">
                    {(data.trafficSources || []).map((source, index) => (
                      <div key={index}>
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text as="span" variant="bodyMd" fontWeight="medium">
                              {source.source}
                            </Text>
                            <Text as="span" variant="bodySm" tone="subdued">
                              {formatNumber(source.visitors)} visitatori - {source.conversionRate}% conv.
                            </Text>
                          </BlockStack>
                          <BlockStack gap="100" align="end">
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {formatCurrency(source.revenue)}
                            </Text>
                            <Text as="span" variant="bodySm" tone="subdued">
                              {source.percentage}%
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
                    ))}
                  </BlockStack>
                </Collapsible>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={LocationIcon} tone="base" />
                    <Text as="h2" variant="headingMd">Vendite per Regione</Text>
                  </InlineStack>
                  <Button
                    size="slim"
                    onClick={() => toggleSection("salesByLocation")}
                    ariaExpanded={expandedSections.salesByLocation}
                    ariaControls="sales-location-section"
                  >
                    {expandedSections.salesByLocation ? "Nascondi" : "Mostra"}
                  </Button>
                </InlineStack>

                <Collapsible
                  open={expandedSections.salesByLocation}
                  id="sales-location-section"
                >
                  <BlockStack gap="300">
                    {(data.salesByLocation || []).map((location, index) => (
                      <div key={index}>
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text as="span" variant="bodyMd" fontWeight="medium">
                              {location.region}
                            </Text>
                            <Text as="span" variant="bodySm" tone="subdued">
                              {formatNumber(location.orders)} ordini
                            </Text>
                          </BlockStack>
                          <BlockStack gap="100" align="end">
                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                              {formatCurrency(location.revenue)}
                            </Text>
                            <Text as="span" variant="bodySm" tone="subdued">
                              {location.percentage}%
                            </Text>
                          </BlockStack>
                        </InlineStack>
                        <Box paddingBlockStart="200">
                          <ProgressBar progress={location.percentage} size="small" />
                        </Box>
                        {index < (data.salesByLocation?.length || 0) - 1 && (
                          <Box paddingBlockStart="300">
                            <Divider />
                          </Box>
                        )}
                      </div>
                    ))}
                  </BlockStack>
                </Collapsible>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Quick Actions */}
        <Card>
          <InlineStack gap="300" align="center" blockAlign="center">
            <Text as="span" variant="bodyMd" tone="subdued">
              Approfondisci:
            </Text>
            <Button onClick={() => router.push("/analytics/vendite")}>
              Analisi Vendite
            </Button>
            <Button onClick={() => router.push("/analytics/clienti")}>
              Analisi Clienti
            </Button>
            <Button onClick={() => router.push("/analytics/report")}>
              Genera Report
            </Button>
          </InlineStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
