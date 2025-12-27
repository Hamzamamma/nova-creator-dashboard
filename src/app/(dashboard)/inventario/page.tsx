"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon,
  Spinner,
  InlineGrid,
  Divider,
  DataTable,
  EmptyState,
  Pagination,
  Box,
  Banner,
  Tooltip,
  ButtonGroup,
} from "@shopify/polaris";
import {
  InventoryIcon,
  AlertCircleIcon,
  PackageIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EditIcon,
  EyeCheckMarkIcon,
  SearchIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import InventoryFilters from "./components/InventoryFilters";
import LowStockAlert from "./components/LowStockAlert";
import StockAdjustModal from "./components/StockAdjustModal";
import type {
  InventoryItem,
  InventoryStats,
  InventoryFiltersState,
  InventoryAlert,
  InventoryLocation,
} from "./types";
import {
  getStockStatusLabel,
  getStockStatusTone,
} from "./types";
import inventoryData from "./data.json";

const ITEMS_PER_PAGE = 10;

export default function InventarioPage() {
  const router = useRouter();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [bulkAdjustModalOpen, setBulkAdjustModalOpen] = useState(false);
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [filters, setFilters] = useState<InventoryFiltersState>({
    location: "",
    stockStatus: "",
    category: "",
    vendor: "",
    sortBy: "updated_desc",
  });

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setInventoryItems(inventoryData.inventoryItems as InventoryItem[]);
        setLocations(inventoryData.locations as InventoryLocation[]);
        setAlerts(inventoryData.alerts as InventoryAlert[]);
        setLoading(false);
      }, 500);
    };
    loadData();
  }, []);

  const vendors = useMemo(() => {
    const uniqueVendors = new Set(inventoryItems.map((item) => item.vendor));
    return Array.from(uniqueVendors).sort();
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    let result = [...inventoryItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.productTitle.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.vendor.toLowerCase().includes(query) ||
          item.barcode.includes(query)
      );
    }

    if (filters.stockStatus) {
      result = result.filter((item) => item.status === filters.stockStatus);
    }

    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters.vendor) {
      result = result.filter((item) => item.vendor === filters.vendor);
    }

    if (filters.location) {
      result = result.filter((item) =>
        item.stockByLocation.some(
          (loc) => loc.locationId === filters.location && loc.quantity > 0
        )
      );
    }

    switch (filters.sortBy) {
      case "quantity_asc":
        result.sort((a, b) => a.totalQuantity - b.totalQuantity);
        break;
      case "quantity_desc":
        result.sort((a, b) => b.totalQuantity - a.totalQuantity);
        break;
      case "title_asc":
        result.sort((a, b) => a.productTitle.localeCompare(b.productTitle));
        break;
      case "title_desc":
        result.sort((a, b) => b.productTitle.localeCompare(a.productTitle));
        break;
      case "sku_asc":
        result.sort((a, b) => a.sku.localeCompare(b.sku));
        break;
      case "sku_desc":
        result.sort((a, b) => b.sku.localeCompare(a.sku));
        break;
      case "value_asc":
        result.sort((a, b) => a.price * a.totalQuantity - b.price * b.totalQuantity);
        break;
      case "value_desc":
        result.sort((a, b) => b.price * b.totalQuantity - a.price * a.totalQuantity);
        break;
      case "updated_desc":
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return result;
  }, [inventoryItems, searchQuery, filters]);

  const stats: InventoryStats = useMemo(() => {
    const totalValue = inventoryItems.reduce(
      (sum, item) => sum + item.price * item.totalQuantity,
      0
    );
    const totalUnits = inventoryItems.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    );

    return {
      totalItems: inventoryItems.length,
      totalValue,
      lowStockCount: inventoryItems.filter((item) => item.status === "low_stock").length,
      outOfStockCount: inventoryItems.filter((item) => item.status === "out_of_stock").length,
      inStockCount: inventoryItems.filter((item) => item.status === "in_stock").length,
      totalUnits,
      alertsCount: alerts.filter((a) => !a.isRead).length,
    };
  }, [inventoryItems, alerts]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const lowStockItems = useMemo(() => {
    return inventoryItems.filter((item) => item.status === "low_stock");
  }, [inventoryItems]);

  const outOfStockItems = useMemo(() => {
    return inventoryItems.filter((item) => item.status === "out_of_stock");
  }, [inventoryItems]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: InventoryFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSelectItem = useCallback((id: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map((item) => item.id)));
    }
  }, [paginatedItems, selectedItems.size]);

  const handleAdjustStock = useCallback((item: InventoryItem) => {
    setSelectedItemForAdjust(item);
    setAdjustModalOpen(true);
  }, []);

  const handleBulkAdjust = useCallback(() => {
    setBulkAdjustModalOpen(true);
  }, []);

  const handleStockAdjusted = useCallback(
    (itemId: string, newQuantity: number) => {
      setInventoryItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            let newStatus: InventoryItem["status"] = "in_stock";
            if (newQuantity === 0) {
              newStatus = "out_of_stock";
            } else if (newQuantity <= item.reorderPoint) {
              newStatus = "low_stock";
            }
            return {
              ...item,
              totalQuantity: newQuantity,
              available: newQuantity - item.reserved,
              status: newStatus,
              lastStockUpdate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        })
      );
      setAdjustModalOpen(false);
      setSelectedItemForAdjust(null);
    },
    []
  );

  const handleDismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statsCards = [
    {
      title: "Articoli Totali",
      value: stats.totalItems.toString(),
      subValue: `${stats.totalUnits} unita`,
      icon: PackageIcon,
      tone: "base" as const,
    },
    {
      title: "Valore Inventario",
      value: formatPrice(stats.totalValue),
      subValue: "Valore totale stock",
      icon: InventoryIcon,
      tone: "success" as const,
    },
    {
      title: "Scorte Basse",
      value: stats.lowStockCount.toString(),
      subValue: "Richiede attenzione",
      icon: ArrowDownIcon,
      tone: "warning" as const,
    },
    {
      title: "Esauriti",
      value: stats.outOfStockCount.toString(),
      subValue: "Da riordinare",
      icon: AlertCircleIcon,
      tone: "critical" as const,
    },
  ];

  const tableRows = paginatedItems.map((item) => [
    <InlineStack key={`select-${item.id}`} gap="300" blockAlign="center">
      <input
        type="checkbox"
        checked={selectedItems.has(item.id)}
        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
        style={{ cursor: "pointer" }}
      />
      <BlockStack gap="050">
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {item.productTitle}
        </Text>
        <Text as="span" variant="bodySm" tone="subdued">
          SKU: {item.sku}
        </Text>
      </BlockStack>
    </InlineStack>,
    <Badge key={`status-${item.id}`} tone={getStockStatusTone(item.status)}>
      {getStockStatusLabel(item.status)}
    </Badge>,
    <BlockStack key={`qty-${item.id}`} gap="050">
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {item.totalQuantity}
      </Text>
      <Text as="span" variant="bodySm" tone="subdued">
        {item.available} disponibili
      </Text>
    </BlockStack>,
    <BlockStack key={`reserved-${item.id}`} gap="050">
      <Text as="span" variant="bodyMd">
        {item.reserved}
      </Text>
      <Text as="span" variant="bodySm" tone="subdued">
        riservati
      </Text>
    </BlockStack>,
    <BlockStack key={`value-${item.id}`} gap="050">
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {formatPrice(item.price * item.totalQuantity)}
      </Text>
      <Text as="span" variant="bodySm" tone="subdued">
        {formatPrice(item.price)}/unita
      </Text>
    </BlockStack>,
    <Text key={`updated-${item.id}`} as="span" variant="bodySm" tone="subdued">
      {formatDate(item.lastStockUpdate)}
    </Text>,
    <InlineStack key={`actions-${item.id}`} gap="200">
      <Tooltip content="Modifica stock">
        <Button
          icon={EditIcon}
          onClick={() => handleAdjustStock(item)}
          variant="plain"
        />
      </Tooltip>
      <Tooltip content="Dettagli">
        <Button
          icon={EyeCheckMarkIcon}
          onClick={() => router.push(`/inventario/${item.id}`)}
          variant="plain"
        />
      </Tooltip>
    </InlineStack>,
  ]);

  if (loading) {
    return (
      <Page title="Inventario">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "100px",
          }}
        >
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  return (
    <Page
      title="Inventario"
      subtitle="Gestisci le scorte e monitora i livelli di magazzino"
      primaryAction={{
        content: "Rettifica stock",
        icon: EditIcon,
        onAction: () => {
          if (selectedItems.size > 0) {
            handleBulkAdjust();
          } else if (paginatedItems.length > 0) {
            handleAdjustStock(paginatedItems[0]);
          }
        },
      }}
      secondaryActions={[
        {
          content: "Movimenti",
          onAction: () => router.push("/inventario/movimenti"),
        },
        { content: "Esporta", onAction: () => {} },
      ]}
    >
      <BlockStack gap="500">
        {/* Alerts Section */}
        {showAlerts && unreadAlerts.length > 0 && (
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={AlertCircleIcon} tone="critical" />
                  <Text as="h3" variant="headingMd">
                    Avvisi Inventario ({unreadAlerts.length})
                  </Text>
                </InlineStack>
                <Button
                  variant="plain"
                  onClick={() => setShowAlerts(false)}
                >
                  Nascondi
                </Button>
              </InlineStack>
              <BlockStack gap="300">
                {unreadAlerts.slice(0, 3).map((alert) => (
                  <LowStockAlert
                    key={alert.id}
                    alert={alert}
                    onDismiss={handleDismissAlert}
                    onViewItem={() => router.push(`/inventario/${alert.inventoryItemId}`)}
                  />
                ))}
              </BlockStack>
              {unreadAlerts.length > 3 && (
                <Button variant="plain" onClick={() => {}}>
                  Vedi tutti gli avvisi ({unreadAlerts.length})
                </Button>
              )}
            </BlockStack>
          </Card>
        )}

        {/* Stats Cards */}
        <InlineGrid columns={{ xs: 2, sm: 2, md: 4 }} gap="400">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={stat.icon} tone="base" />
                    <Text as="span" variant="bodySm" tone="subdued">
                      {stat.title}
                    </Text>
                  </InlineStack>
                </InlineStack>
                <Text as="p" variant="headingXl" fontWeight="semibold">
                  {stat.value}
                </Text>
                <Text as="span" variant="bodySm" tone="subdued">
                  {stat.subValue}
                </Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Quick Status Cards */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
            {lowStockItems.length > 0 && (
              <Card>
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={ArrowDownIcon} tone="warning" />
                    <Text as="h3" variant="headingMd">
                      Scorte Basse ({lowStockItems.length})
                    </Text>
                  </InlineStack>
                  <BlockStack gap="200">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <InlineStack
                        key={item.id}
                        align="space-between"
                        blockAlign="center"
                      >
                        <BlockStack gap="050">
                          <Text as="span" variant="bodySm" fontWeight="semibold">
                            {item.productTitle}
                          </Text>
                          <Text as="span" variant="bodySm" tone="subdued">
                            {item.sku}
                          </Text>
                        </BlockStack>
                        <Badge tone="warning">{item.totalQuantity} unita</Badge>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  {lowStockItems.length > 3 && (
                    <Button
                      variant="plain"
                      onClick={() =>
                        handleFiltersChange({ ...filters, stockStatus: "low_stock" })
                      }
                    >
                      Vedi tutti ({lowStockItems.length})
                    </Button>
                  )}
                </BlockStack>
              </Card>
            )}

            {outOfStockItems.length > 0 && (
              <Card>
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={AlertCircleIcon} tone="critical" />
                    <Text as="h3" variant="headingMd">
                      Esauriti ({outOfStockItems.length})
                    </Text>
                  </InlineStack>
                  <BlockStack gap="200">
                    {outOfStockItems.slice(0, 3).map((item) => (
                      <InlineStack
                        key={item.id}
                        align="space-between"
                        blockAlign="center"
                      >
                        <BlockStack gap="050">
                          <Text as="span" variant="bodySm" fontWeight="semibold">
                            {item.productTitle}
                          </Text>
                          <Text as="span" variant="bodySm" tone="subdued">
                            {item.sku}
                          </Text>
                        </BlockStack>
                        <Badge tone="critical">Esaurito</Badge>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  {outOfStockItems.length > 3 && (
                    <Button
                      variant="plain"
                      onClick={() =>
                        handleFiltersChange({ ...filters, stockStatus: "out_of_stock" })
                      }
                    >
                      Vedi tutti ({outOfStockItems.length})
                    </Button>
                  )}
                </BlockStack>
              </Card>
            )}
          </InlineGrid>
        )}

        {/* Filters */}
        <InventoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          locations={locations}
          vendors={vendors}
          totalResults={filteredItems.length}
        />

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="span" variant="bodyMd">
                {selectedItems.size} articoli selezionati
              </Text>
              <ButtonGroup>
                <Button onClick={handleBulkAdjust}>Rettifica stock</Button>
                <Button onClick={() => setSelectedItems(new Set())}>
                  Deseleziona
                </Button>
              </ButtonGroup>
            </InlineStack>
          </Card>
        )}

        {/* Data Table */}
        <Card padding="0">
          <BlockStack gap="0">
            <Box padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedItems.length > 0 &&
                      selectedItems.size === paginatedItems.length
                    }
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                  <Text as="span" variant="bodySm" tone="subdued">
                    Seleziona tutti
                  </Text>
                </InlineStack>
                <Text as="span" variant="bodySm" tone="subdued">
                  {filteredItems.length} articoli
                </Text>
              </InlineStack>
            </Box>

            <Divider />

            {filteredItems.length > 0 ? (
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "numeric",
                  "numeric",
                  "numeric",
                  "text",
                  "text",
                ]}
                headings={[
                  "Prodotto",
                  "Stato",
                  "Quantita",
                  "Riservati",
                  "Valore",
                  "Ultimo agg.",
                  "Azioni",
                ]}
                rows={tableRows}
                footerContent={
                  totalPages > 1
                    ? `Pagina ${currentPage} di ${totalPages}`
                    : undefined
                }
              />
            ) : (
              <Box padding="400">
                <EmptyState
                  heading="Nessun articolo trovato"
                  action={{
                    content: "Cancella filtri",
                    onAction: () => {
                      setFilters({
                        location: "",
                        stockStatus: "",
                        category: "",
                        vendor: "",
                        sortBy: "updated_desc",
                      });
                      setSearchQuery("");
                    },
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Prova a modificare i filtri di ricerca</p>
                </EmptyState>
              </Box>
            )}
          </BlockStack>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <InlineStack align="center">
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setCurrentPage((prev) => prev - 1)}
              hasNext={currentPage < totalPages}
              onNext={() => setCurrentPage((prev) => prev + 1)}
            />
          </InlineStack>
        )}
      </BlockStack>

      {/* Stock Adjust Modal */}
      {selectedItemForAdjust && (
        <StockAdjustModal
          open={adjustModalOpen}
          onClose={() => {
            setAdjustModalOpen(false);
            setSelectedItemForAdjust(null);
          }}
          item={selectedItemForAdjust}
          locations={locations}
          onStockAdjusted={handleStockAdjusted}
        />
      )}

      {/* Bulk Adjust Modal */}
      {bulkAdjustModalOpen && selectedItems.size > 0 && (
        <StockAdjustModal
          open={bulkAdjustModalOpen}
          onClose={() => setBulkAdjustModalOpen(false)}
          item={inventoryItems.find((item) => selectedItems.has(item.id)) || null}
          locations={locations}
          onStockAdjusted={(itemId, newQuantity) => {
            selectedItems.forEach((id) => {
              handleStockAdjusted(id, newQuantity);
            });
            setBulkAdjustModalOpen(false);
            setSelectedItems(new Set());
          }}
          isBulk
          bulkCount={selectedItems.size}
        />
      )}
    </Page>
  );
}
