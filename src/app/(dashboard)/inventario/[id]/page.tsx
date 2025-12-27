"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Box,
  TextField,
  Select,
  Banner,
  Modal,
  FormLayout,
} from "@shopify/polaris";
import {
  InventoryIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LocationIcon,
  EditIcon,
  PackageIcon,
  AlertCircleIcon,
  RefreshIcon,
  ProductIcon,
} from "@shopify/polaris-icons";
import StockAdjustModal from "../components/StockAdjustModal";
import type {
  InventoryItem,
  StockMovement,
  InventoryLocation,
  StockByLocation,
} from "../types";
import {
  getStockStatusLabel,
  getStockStatusTone,
  getMovementTypeLabel,
  getMovementTypeTone,
} from "../types";
import inventoryData from "../data.json";

export default function InventoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [reorderPoint, setReorderPoint] = useState("");
  const [reorderQuantity, setReorderQuantity] = useState("");

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        const foundItem = inventoryData.inventoryItems.find(
          (inv) => inv.id === itemId
        ) as InventoryItem | undefined;

        if (foundItem) {
          setItem(foundItem);
          setReorderPoint(foundItem.reorderPoint.toString());
          setReorderQuantity(foundItem.reorderQuantity.toString());

          // Get movements for this item
          const itemMovements = inventoryData.stockMovements.filter(
            (mov) => mov.inventoryItemId === itemId
          ) as StockMovement[];
          setMovements(
            itemMovements.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );

          setLocations(inventoryData.locations as InventoryLocation[]);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }, 500);
    };
    loadData();
  }, [itemId]);

  const stockValue = useMemo(() => {
    if (!item) return { retail: 0, cost: 0, profit: 0 };
    const retail = item.price * item.totalQuantity;
    const cost = (item.costPerItem || 0) * item.totalQuantity;
    return {
      retail,
      cost,
      profit: retail - cost,
    };
  }, [item]);

  const handleStockAdjusted = useCallback(
    (itemId: string, newQuantity: number) => {
      if (item) {
        let newStatus: InventoryItem["status"] = "in_stock";
        if (newQuantity === 0) {
          newStatus = "out_of_stock";
        } else if (newQuantity <= item.reorderPoint) {
          newStatus = "low_stock";
        }

        setItem({
          ...item,
          totalQuantity: newQuantity,
          available: newQuantity - item.reserved,
          status: newStatus,
          lastStockUpdate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Add a new movement to the list
        const newMovement: StockMovement = {
          id: `mov_new_${Date.now()}`,
          inventoryItemId: item.id,
          productTitle: item.productTitle,
          sku: item.sku,
          type: "adjusted",
          quantity: newQuantity - item.totalQuantity,
          previousQuantity: item.totalQuantity,
          newQuantity: newQuantity,
          fromLocationId: null,
          fromLocationName: null,
          toLocationId: "loc_001",
          toLocationName: "Magazzino Principale",
          reason: "Rettifica manuale",
          reference: `ADJ-${Date.now()}`,
          orderId: null,
          userId: "user_001",
          userName: "Admin",
          createdAt: new Date().toISOString(),
        };

        setMovements((prev) => [newMovement, ...prev]);
      }
      setAdjustModalOpen(false);
    },
    [item]
  );

  const handleSaveSettings = useCallback(() => {
    if (item) {
      const newReorderPoint = parseInt(reorderPoint) || 0;
      const newReorderQuantity = parseInt(reorderQuantity) || 0;

      let newStatus = item.status;
      if (item.totalQuantity === 0) {
        newStatus = "out_of_stock";
      } else if (item.totalQuantity <= newReorderPoint) {
        newStatus = "low_stock";
      } else {
        newStatus = "in_stock";
      }

      setItem({
        ...item,
        reorderPoint: newReorderPoint,
        reorderQuantity: newReorderQuantity,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
    setSettingsModalOpen(false);
  }, [item, reorderPoint, reorderQuantity]);

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

  if (loading) {
    return (
      <Page title="Dettaglio Inventario">
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

  if (notFound || !item) {
    return (
      <Page
        title="Articolo non trovato"
        backAction={{ content: "Inventario", onAction: () => router.push("/inventario") }}
      >
        <Card>
          <EmptyState
            heading="Articolo non trovato"
            action={{
              content: "Torna all'inventario",
              onAction: () => router.push("/inventario"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>L'articolo richiesto non esiste o e stato rimosso.</p>
          </EmptyState>
        </Card>
      </Page>
    );
  }

  const locationRows = item.stockByLocation.map((loc) => [
    <InlineStack key={`loc-${loc.locationId}`} gap="200" blockAlign="center">
      <Icon source={LocationIcon} tone="base" />
      <Text as="span" variant="bodyMd">
        {loc.locationName}
      </Text>
    </InlineStack>,
    <Text key={`qty-${loc.locationId}`} as="span" variant="bodyMd" fontWeight="semibold">
      {loc.quantity}
    </Text>,
    <Text key={`avail-${loc.locationId}`} as="span" variant="bodyMd">
      {loc.available}
    </Text>,
    <Text key={`res-${loc.locationId}`} as="span" variant="bodyMd" tone="subdued">
      {loc.reserved}
    </Text>,
    <Text key={`val-${loc.locationId}`} as="span" variant="bodyMd">
      {formatPrice(item.price * loc.quantity)}
    </Text>,
  ]);

  const movementRows = movements.slice(0, 10).map((movement) => [
    <Badge key={`type-${movement.id}`} tone={getMovementTypeTone(movement.type)}>
      {getMovementTypeLabel(movement.type)}
    </Badge>,
    getQuantityDisplay(movement),
    <Text key={`stock-${movement.id}`} as="span" variant="bodySm">
      {movement.previousQuantity} → {movement.newQuantity}
    </Text>,
    <BlockStack key={`reason-${movement.id}`} gap="050">
      <Text as="span" variant="bodySm">
        {movement.reason}
      </Text>
      {movement.reference && (
        <Text as="span" variant="bodySm" tone="subdued">
          {movement.reference}
        </Text>
      )}
    </BlockStack>,
    <Text key={`date-${movement.id}`} as="span" variant="bodySm" tone="subdued">
      {formatDateShort(movement.createdAt)}
    </Text>,
  ]);

  return (
    <Page
      title={item.productTitle}
      subtitle={`SKU: ${item.sku}`}
      backAction={{ content: "Inventario", onAction: () => router.push("/inventario") }}
      primaryAction={{
        content: "Rettifica stock",
        icon: EditIcon,
        onAction: () => setAdjustModalOpen(true),
      }}
      secondaryActions={[
        {
          content: "Impostazioni",
          onAction: () => setSettingsModalOpen(true),
        },
        {
          content: "Vedi prodotto",
          icon: ProductIcon,
          onAction: () => router.push(`/prodotti/${item.productId}`),
        },
      ]}
    >
      <BlockStack gap="500">
        {/* Alert Banner */}
        {item.status === "out_of_stock" && (
          <Banner tone="critical" title="Prodotto esaurito">
            <p>
              Questo prodotto e completamente esaurito. Effettua un ordine al
              fornitore per rifornire il magazzino.
            </p>
          </Banner>
        )}

        {item.status === "low_stock" && (
          <Banner tone="warning" title="Scorte basse">
            <p>
              Le scorte di questo prodotto sono al di sotto del punto di riordino
              ({item.reorderPoint} unita). Considera di effettuare un ordine.
            </p>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            {/* Stock Overview */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Panoramica Stock
                  </Text>
                  <Badge tone={getStockStatusTone(item.status)}>
                    {getStockStatusLabel(item.status)}
                  </Badge>
                </InlineStack>

                <InlineGrid columns={{ xs: 2, sm: 4 }} gap="400">
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Quantita Totale
                    </Text>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      {item.totalQuantity}
                    </Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Disponibili
                    </Text>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      {item.available}
                    </Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Riservati
                    </Text>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      {item.reserved}
                    </Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Punto Riordino
                    </Text>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      {item.reorderPoint}
                    </Text>
                  </BlockStack>
                </InlineGrid>

                <Divider />

                <Text as="span" variant="bodySm" tone="subdued">
                  Ultimo aggiornamento: {formatDate(item.lastStockUpdate)}
                </Text>
              </BlockStack>
            </Card>

            {/* Stock by Location */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Stock per Posizione
                  </Text>
                  <Button variant="plain" icon={RefreshIcon}>
                    Trasferisci
                  </Button>
                </InlineStack>

                <DataTable
                  columnContentTypes={["text", "numeric", "numeric", "numeric", "numeric"]}
                  headings={["Posizione", "Quantita", "Disponibili", "Riservati", "Valore"]}
                  rows={locationRows}
                />
              </BlockStack>
            </Card>

            {/* Movement History */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Storico Movimenti
                  </Text>
                  <Button
                    variant="plain"
                    onClick={() => router.push("/inventario/movimenti")}
                  >
                    Vedi tutti
                  </Button>
                </InlineStack>

                {movements.length > 0 ? (
                  <DataTable
                    columnContentTypes={["text", "text", "text", "text", "text"]}
                    headings={["Tipo", "Quantita", "Stock", "Motivo", "Data"]}
                    rows={movementRows}
                  />
                ) : (
                  <Box padding="400">
                    <BlockStack gap="200" inlineAlign="center">
                      <Icon source={PackageIcon} tone="subdued" />
                      <Text as="p" tone="subdued" alignment="center">
                        Nessun movimento registrato per questo articolo
                      </Text>
                    </BlockStack>
                  </Box>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            {/* Product Info */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Informazioni Prodotto
                </Text>

                <BlockStack gap="300">
                  <BlockStack gap="050">
                    <Text as="span" variant="bodySm" tone="subdued">
                      SKU
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {item.sku}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="050">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Codice a barre
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {item.barcode}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="050">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Categoria
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {item.category}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="050">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Fornitore
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {item.vendor}
                    </Text>
                  </BlockStack>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Stock Value */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Valore Inventario
                </Text>

                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Prezzo vendita
                    </Text>
                    <Text as="span" variant="bodyMd">
                      {formatPrice(item.price)}
                    </Text>
                  </InlineStack>

                  {item.costPerItem && (
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodySm" tone="subdued">
                        Costo per unita
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {formatPrice(item.costPerItem)}
                      </Text>
                    </InlineStack>
                  )}

                  <Divider />

                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Valore al dettaglio
                    </Text>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {formatPrice(stockValue.retail)}
                    </Text>
                  </InlineStack>

                  {item.costPerItem && (
                    <>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodySm" tone="subdued">
                          Costo totale
                        </Text>
                        <Text as="span" variant="bodyMd">
                          {formatPrice(stockValue.cost)}
                        </Text>
                      </InlineStack>

                      <InlineStack align="space-between">
                        <Text as="span" variant="bodySm" tone="subdued">
                          Profitto potenziale
                        </Text>
                        <Text as="span" variant="bodyMd" tone="success" fontWeight="semibold">
                          {formatPrice(stockValue.profit)}
                        </Text>
                      </InlineStack>
                    </>
                  )}
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Reorder Settings */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Impostazioni Riordino
                  </Text>
                  <Button
                    variant="plain"
                    icon={EditIcon}
                    onClick={() => setSettingsModalOpen(true)}
                  />
                </InlineStack>

                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Punto di riordino
                    </Text>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {item.reorderPoint} unita
                    </Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Quantita riordino
                    </Text>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {item.reorderQuantity} unita
                    </Text>
                  </InlineStack>

                  {item.totalQuantity <= item.reorderPoint && (
                    <>
                      <Divider />
                      <Banner tone="warning">
                        <p>
                          Stock attuale ({item.totalQuantity}) sotto il punto di riordino.
                          Si consiglia di ordinare {item.reorderQuantity} unita.
                        </p>
                      </Banner>
                    </>
                  )}
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Timestamps */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Creato
                  </Text>
                  <Text as="span" variant="bodySm">
                    {formatDate(item.createdAt)}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">
                    Modificato
                  </Text>
                  <Text as="span" variant="bodySm">
                    {formatDate(item.updatedAt)}
                  </Text>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        item={item}
        locations={locations}
        onStockAdjusted={handleStockAdjusted}
      />

      {/* Reorder Settings Modal */}
      <Modal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="Impostazioni Riordino"
        primaryAction={{
          content: "Salva",
          onAction: handleSaveSettings,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setSettingsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Banner>
              <p>
                Imposta il punto di riordino per ricevere avvisi quando le scorte
                scendono sotto questa soglia.
              </p>
            </Banner>

            <FormLayout>
              <TextField
                label="Punto di riordino"
                type="number"
                value={reorderPoint}
                onChange={setReorderPoint}
                helpText="Riceverai un avviso quando lo stock scende sotto questo valore"
                autoComplete="off"
                min={0}
              />

              <TextField
                label="Quantita da riordinare"
                type="number"
                value={reorderQuantity}
                onChange={setReorderQuantity}
                helpText="Quantita suggerita da ordinare quando lo stock e basso"
                autoComplete="off"
                min={0}
              />
            </FormLayout>

            <BlockStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">
                Stock attuale: {item.totalQuantity} unita
              </Text>
              {parseInt(reorderPoint) > 0 && item.totalQuantity <= parseInt(reorderPoint) && (
                <Text as="span" variant="bodySm" tone="warning">
                  Lo stock attuale e gia sotto il punto di riordino impostato
                </Text>
              )}
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
