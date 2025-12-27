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
  Select,
  TextField,
  Filters,
  ChoiceList,
  Popover,
  ActionList,
  DatePicker,
  Modal,
} from "@shopify/polaris";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshIcon,
  PackageIcon,
  CalendarIcon,
  FilterIcon,
  ExportIcon,
  EyeCheckMarkIcon,
} from "@shopify/polaris-icons";
import type { StockMovement, MovementType, InventoryLocation } from "../types";
import {
  getMovementTypeLabel,
  getMovementTypeTone,
  MOVEMENT_TYPE_OPTIONS,
} from "../types";
import inventoryData from "../data.json";

const ITEMS_PER_PAGE = 15;

interface MovementFilters {
  type: string;
  locationId: string;
  dateFrom: string;
  dateTo: string;
}

export default function MovimentiPage() {
  const router = useRouter();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [filters, setFilters] = useState<MovementFilters>({
    type: "",
    locationId: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        // Sort movements by date descending
        const sortedMovements = [...inventoryData.stockMovements].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) as StockMovement[];
        setMovements(sortedMovements);
        setLocations(inventoryData.locations as InventoryLocation[]);
        setLoading(false);
      }, 500);
    };
    loadData();
  }, []);

  const filteredMovements = useMemo(() => {
    let result = [...movements];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (mov) =>
          mov.productTitle.toLowerCase().includes(query) ||
          mov.sku.toLowerCase().includes(query) ||
          (mov.reference && mov.reference.toLowerCase().includes(query)) ||
          mov.reason.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      result = result.filter((mov) => mov.type === filters.type);
    }

    if (filters.locationId) {
      result = result.filter(
        (mov) =>
          mov.fromLocationId === filters.locationId ||
          mov.toLocationId === filters.locationId
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((mov) => new Date(mov.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((mov) => new Date(mov.createdAt) <= toDate);
    }

    return result;
  }, [movements, searchQuery, filters]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMovements = movements.filter(
      (mov) => new Date(mov.createdAt) >= today
    );

    const received = movements.filter((mov) => mov.type === "received");
    const sold = movements.filter((mov) => mov.type === "sold");
    const transferred = movements.filter((mov) => mov.type === "transferred");

    const totalReceived = received.reduce((sum, mov) => sum + mov.quantity, 0);
    const totalSold = sold.reduce((sum, mov) => sum + Math.abs(mov.quantity), 0);

    return {
      todayCount: todayMovements.length,
      receivedCount: received.length,
      soldCount: sold.length,
      transferredCount: transferred.length,
      totalReceived,
      totalSold,
    };
  }, [movements]);

  const paginatedMovements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMovements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMovements, currentPage]);

  const totalPages = Math.ceil(filteredMovements.length / ITEMS_PER_PAGE);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (key: keyof MovementFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      type: "",
      locationId: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: { start: Date; end: Date }) => {
    setSelectedDates(range);
    setFilters((prev) => ({
      ...prev,
      dateFrom: range.start.toISOString().split("T")[0],
      dateTo: range.end.toISOString().split("T")[0],
    }));
  }, []);

  const handleViewDetails = useCallback((movement: StockMovement) => {
    setSelectedMovement(movement);
    setDetailModalOpen(true);
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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case "received":
      case "returned":
        return ArrowUpIcon;
      case "sold":
      case "damaged":
        return ArrowDownIcon;
      case "transferred":
        return RefreshIcon;
      default:
        return PackageIcon;
    }
  };

  const getQuantityDisplay = (movement: StockMovement) => {
    const isPositive = movement.quantity > 0;
    return (
      <InlineStack gap="100" blockAlign="center">
        <Icon
          source={isPositive ? ArrowUpIcon : ArrowDownIcon}
          tone={isPositive ? "success" : "critical"}
        />
        <Text
          as="span"
          variant="bodyMd"
          fontWeight="semibold"
          tone={isPositive ? "success" : "critical"}
        >
          {isPositive ? "+" : ""}
          {movement.quantity}
        </Text>
      </InlineStack>
    );
  };

  const locationOptions = [
    { label: "Tutte le posizioni", value: "" },
    ...locations.map((loc) => ({ label: loc.name, value: loc.id })),
  ];

  const statsCards = [
    {
      title: "Movimenti Oggi",
      value: stats.todayCount.toString(),
      icon: CalendarIcon,
      tone: "base" as const,
    },
    {
      title: "Ricevuti",
      value: stats.receivedCount.toString(),
      subValue: `+${stats.totalReceived} unita`,
      icon: ArrowUpIcon,
      tone: "success" as const,
    },
    {
      title: "Venduti",
      value: stats.soldCount.toString(),
      subValue: `-${stats.totalSold} unita`,
      icon: ArrowDownIcon,
      tone: "info" as const,
    },
    {
      title: "Trasferiti",
      value: stats.transferredCount.toString(),
      icon: RefreshIcon,
      tone: "warning" as const,
    },
  ];

  const tableRows = paginatedMovements.map((movement) => [
    <BlockStack key={`product-${movement.id}`} gap="050">
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {movement.productTitle}
      </Text>
      <Text as="span" variant="bodySm" tone="subdued">
        SKU: {movement.sku}
      </Text>
    </BlockStack>,
    <Badge key={`type-${movement.id}`} tone={getMovementTypeTone(movement.type)}>
      {getMovementTypeLabel(movement.type)}
    </Badge>,
    getQuantityDisplay(movement),
    <BlockStack key={`stock-${movement.id}`} gap="050">
      <Text as="span" variant="bodySm">
        {movement.previousQuantity} → {movement.newQuantity}
      </Text>
    </BlockStack>,
    <BlockStack key={`location-${movement.id}`} gap="050">
      {movement.fromLocationName && (
        <Text as="span" variant="bodySm">
          Da: {movement.fromLocationName}
        </Text>
      )}
      {movement.toLocationName && (
        <Text as="span" variant="bodySm">
          A: {movement.toLocationName}
        </Text>
      )}
      {!movement.fromLocationName && !movement.toLocationName && (
        <Text as="span" variant="bodySm" tone="subdued">
          -
        </Text>
      )}
    </BlockStack>,
    <BlockStack key={`ref-${movement.id}`} gap="050">
      <Text as="span" variant="bodySm">
        {movement.reference || "-"}
      </Text>
      <Text as="span" variant="bodySm" tone="subdued">
        {movement.userName}
      </Text>
    </BlockStack>,
    <Text key={`date-${movement.id}`} as="span" variant="bodySm" tone="subdued">
      {formatDateShort(movement.createdAt)}
    </Text>,
    <Button
      key={`action-${movement.id}`}
      icon={EyeCheckMarkIcon}
      variant="plain"
      onClick={() => handleViewDetails(movement)}
    />,
  ]);

  if (loading) {
    return (
      <Page title="Movimenti Inventario">
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

  return (
    <Page
      title="Movimenti Inventario"
      subtitle="Storico di tutti i movimenti di magazzino"
      backAction={{ content: "Inventario", onAction: () => router.push("/inventario") }}
      secondaryActions={[
        {
          content: "Esporta",
          icon: ExportIcon,
          onAction: () => {},
        },
      ]}
    >
      <BlockStack gap="500">
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
                {stat.subValue && (
                  <Text as="span" variant="bodySm" tone="subdued">
                    {stat.subValue}
                  </Text>
                )}
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Filters */}
        <Card>
          <BlockStack gap="400">
            <TextField
              label=""
              placeholder="Cerca per prodotto, SKU, riferimento..."
              value={searchQuery}
              onChange={handleSearch}
              autoComplete="off"
              clearButton
              onClearButtonClick={() => handleSearch("")}
            />
            <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
              <Select
                label="Tipo movimento"
                options={MOVEMENT_TYPE_OPTIONS}
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
              />
              <Select
                label="Posizione"
                options={locationOptions}
                value={filters.locationId}
                onChange={(value) => handleFilterChange("locationId", value)}
              />
              <TextField
                label="Data inizio"
                type="date"
                value={filters.dateFrom}
                onChange={(value) => handleFilterChange("dateFrom", value)}
                autoComplete="off"
              />
              <TextField
                label="Data fine"
                type="date"
                value={filters.dateTo}
                onChange={(value) => handleFilterChange("dateTo", value)}
                autoComplete="off"
              />
            </InlineGrid>
            {(filters.type ||
              filters.locationId ||
              filters.dateFrom ||
              filters.dateTo ||
              searchQuery) && (
              <InlineStack align="end">
                <Button variant="plain" onClick={handleClearFilters}>
                  Cancella filtri
                </Button>
              </InlineStack>
            )}
          </BlockStack>
        </Card>

        {/* Movements Table */}
        <Card padding="0">
          <BlockStack gap="0">
            <Box padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  {filteredMovements.length} movimenti
                </Text>
                {filteredMovements.length !== movements.length && (
                  <Text as="span" variant="bodySm" tone="subdued">
                    Filtrati da {movements.length} totali
                  </Text>
                )}
              </InlineStack>
            </Box>

            <Divider />

            {filteredMovements.length > 0 ? (
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                ]}
                headings={[
                  "Prodotto",
                  "Tipo",
                  "Quantita",
                  "Stock",
                  "Posizione",
                  "Riferimento",
                  "Data",
                  "",
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
                  heading="Nessun movimento trovato"
                  action={{
                    content: "Cancella filtri",
                    onAction: handleClearFilters,
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

      {/* Movement Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedMovement(null);
        }}
        title="Dettagli Movimento"
      >
        <Modal.Section>
          {selectedMovement && (
            <BlockStack gap="400">
              <InlineGrid columns={2} gap="400">
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Prodotto
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    {selectedMovement.productTitle}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    SKU
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {selectedMovement.sku}
                  </Text>
                </BlockStack>
              </InlineGrid>

              <Divider />

              <InlineGrid columns={2} gap="400">
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Tipo Movimento
                  </Text>
                  <Badge tone={getMovementTypeTone(selectedMovement.type)}>
                    {getMovementTypeLabel(selectedMovement.type)}
                  </Badge>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Quantita
                  </Text>
                  {getQuantityDisplay(selectedMovement)}
                </BlockStack>
              </InlineGrid>

              <InlineGrid columns={2} gap="400">
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Stock Precedente
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {selectedMovement.previousQuantity}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Nuovo Stock
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    {selectedMovement.newQuantity}
                  </Text>
                </BlockStack>
              </InlineGrid>

              <Divider />

              {(selectedMovement.fromLocationName || selectedMovement.toLocationName) && (
                <InlineGrid columns={2} gap="400">
                  {selectedMovement.fromLocationName && (
                    <BlockStack gap="100">
                      <Text as="span" variant="bodySm" tone="subdued">
                        Da Posizione
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {selectedMovement.fromLocationName}
                      </Text>
                    </BlockStack>
                  )}
                  {selectedMovement.toLocationName && (
                    <BlockStack gap="100">
                      <Text as="span" variant="bodySm" tone="subdued">
                        A Posizione
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {selectedMovement.toLocationName}
                      </Text>
                    </BlockStack>
                  )}
                </InlineGrid>
              )}

              <BlockStack gap="100">
                <Text as="span" variant="bodySm" tone="subdued">
                  Motivo
                </Text>
                <Text as="span" variant="bodyMd">
                  {selectedMovement.reason}
                </Text>
              </BlockStack>

              <InlineGrid columns={2} gap="400">
                {selectedMovement.reference && (
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Riferimento
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {selectedMovement.reference}
                    </Text>
                  </BlockStack>
                )}
                {selectedMovement.orderId && (
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Ordine
                    </Text>
                    <Button
                      variant="plain"
                      onClick={() => router.push(`/ordini/${selectedMovement.orderId}`)}
                    >
                      {selectedMovement.orderId}
                    </Button>
                  </BlockStack>
                )}
              </InlineGrid>

              <Divider />

              <InlineGrid columns={2} gap="400">
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Eseguito da
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {selectedMovement.userName}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Data e Ora
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {formatDate(selectedMovement.createdAt)}
                  </Text>
                </BlockStack>
              </InlineGrid>
            </BlockStack>
          )}
        </Modal.Section>
        <Modal.Section>
          <InlineStack align="end">
            <Button
              onClick={() => {
                if (selectedMovement) {
                  router.push(`/inventario/${selectedMovement.inventoryItemId}`);
                }
              }}
            >
              Vai al prodotto
            </Button>
          </InlineStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
