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
  Modal,
  Pagination,
  ButtonGroup,
  Tooltip,
  Box,
  Banner,
} from "@shopify/polaris";
import {
  ProductIcon,
  PlusIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  InventoryIcon,
  EyeCheckMarkIcon,
} from "@shopify/polaris-icons";
import ProductFilters from "./components/ProductFilters";
import ProductCard from "./components/ProductCard";
import type { Product, ProductFiltersState, ProductStats } from "./types";
import productsData from "./data.json";

const ITEMS_PER_PAGE = 10;

export default function ProdottiPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<ProductFiltersState>({
    status: "",
    category: "",
    priceMin: "",
    priceMax: "",
    stockStatus: "",
    vendor: "",
    sortBy: "created_desc",
  });

  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      setTimeout(() => {
        setProducts(productsData.products as Product[]);
        setLoading(false);
      }, 500);
    };
    loadProducts();
  }, []);

  const vendors = useMemo(() => {
    const uniqueVendors = new Set(products.map((p) => p.vendor));
    return Array.from(uniqueVendors).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.vendor.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.vendor) {
      result = result.filter((p) => p.vendor === filters.vendor);
    }

    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case "in_stock":
          result = result.filter((p) => p.quantity > 10);
          break;
        case "low_stock":
          result = result.filter((p) => p.quantity > 0 && p.quantity <= 10);
          break;
        case "out_of_stock":
          result = result.filter((p) => p.quantity === 0);
          break;
      }
    }

    if (filters.priceMin) {
      result = result.filter((p) => p.price >= parseFloat(filters.priceMin));
    }

    if (filters.priceMax) {
      result = result.filter((p) => p.price <= parseFloat(filters.priceMax));
    }

    switch (filters.sortBy) {
      case "created_asc":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "created_desc":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "quantity_asc":
        result.sort((a, b) => a.quantity - b.quantity);
        break;
      case "quantity_desc":
        result.sort((a, b) => b.quantity - a.quantity);
        break;
    }

    return result;
  }, [products, searchQuery, filters]);

  const stats: ProductStats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      draft: products.filter((p) => p.status === "draft").length,
      archived: products.filter((p) => p.status === "archived").length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
      lowStock: products.filter((p) => p.quantity > 0 && p.quantity <= 10)
        .length,
    };
  }, [products]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: ProductFiltersState) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    []
  );

  const handleSelectProduct = useCallback((id: string, selected: boolean) => {
    setSelectedProducts((prev) => {
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
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  }, [paginatedProducts, selectedProducts.size]);

  const handleDeleteProduct = useCallback((id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const confirmDeleteProduct = useCallback(() => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      setSelectedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productToDelete);
        return newSet;
      });
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
  }, [productToDelete]);

  const handleBulkDelete = useCallback(() => {
    setBulkDeleteModalOpen(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    setProducts((prev) => prev.filter((p) => !selectedProducts.has(p.id)));
    setSelectedProducts(new Set());
    setBulkDeleteModalOpen(false);
  }, [selectedProducts]);

  const handleBulkPublish = useCallback(() => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.has(p.id) ? { ...p, status: "active" as const } : p
      )
    );
    setSelectedProducts(new Set());
  }, [selectedProducts]);

  const handleBulkUnpublish = useCallback(() => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.has(p.id) ? { ...p, status: "draft" as const } : p
      )
    );
    setSelectedProducts(new Set());
  }, [selectedProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return <Badge tone="success">Attivo</Badge>;
      case "draft":
        return <Badge tone="warning">Bozza</Badge>;
      case "archived":
        return <Badge tone="info">Archiviato</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const statsCards = [
    {
      title: "Totale Prodotti",
      value: stats.total,
      icon: ProductIcon,
      tone: "base" as const,
    },
    {
      title: "Pubblicati",
      value: stats.active,
      icon: EyeCheckMarkIcon,
      tone: "success" as const,
    },
    {
      title: "Bozze",
      value: stats.draft,
      icon: EditIcon,
      tone: "warning" as const,
    },
    {
      title: "Esauriti",
      value: stats.outOfStock,
      icon: InventoryIcon,
      tone: "critical" as const,
    },
  ];

  const tableRows = paginatedProducts.map((product) => [
    <InlineStack key={`select-${product.id}`} gap="300" blockAlign="center">
      <input
        type="checkbox"
        checked={selectedProducts.has(product.id)}
        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
        style={{ cursor: "pointer" }}
      />
      <BlockStack gap="050">
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {product.title}
        </Text>
        <Text as="span" variant="bodySm" tone="subdued">
          {product.vendor}
        </Text>
      </BlockStack>
    </InlineStack>,
    getStatusBadge(product.status),
    <BlockStack key={`inv-${product.id}`} gap="050">
      <Text as="span" variant="bodyMd">
        {product.quantity} in stock
      </Text>
      {product.quantity === 0 && (
        <Badge tone="critical" size="small">
          Esaurito
        </Badge>
      )}
      {product.quantity > 0 && product.quantity <= 10 && (
        <Badge tone="attention" size="small">
          Scorte basse
        </Badge>
      )}
    </BlockStack>,
    product.category || "-",
    <BlockStack key={`price-${product.id}`} gap="050">
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {formatPrice(product.price)}
      </Text>
      {product.compareAtPrice && (
        <Text
          as="span"
          variant="bodySm"
          tone="subdued"
          textDecorationLine="line-through"
        >
          {formatPrice(product.compareAtPrice)}
        </Text>
      )}
    </BlockStack>,
    <InlineStack key={`actions-${product.id}`} gap="200">
      <Tooltip content="Modifica">
        <Button
          icon={EditIcon}
          onClick={() => router.push(`/prodotti/${product.id}`)}
          variant="plain"
        />
      </Tooltip>
      <Tooltip content="Elimina">
        <Button
          icon={DeleteIcon}
          onClick={() => handleDeleteProduct(product.id)}
          variant="plain"
          tone="critical"
        />
      </Tooltip>
    </InlineStack>,
  ]);

  if (loading) {
    return (
      <Page title="Prodotti">
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
      title="Prodotti"
      subtitle="Gestisci il catalogo dei tuoi prodotti"
      primaryAction={{
        content: "Aggiungi prodotto",
        icon: PlusIcon,
        onAction: () => router.push("/prodotti/nuovo"),
      }}
      secondaryActions={[{ content: "Esporta", onAction: () => {} }]}
    >
      <BlockStack gap="500">
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
                {stat.title === "Esauriti" && stats.lowStock > 0 && (
                  <Text as="span" variant="bodySm" tone="subdued">
                    +{stats.lowStock} con scorte basse
                  </Text>
                )}
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          vendors={vendors}
          totalResults={filteredProducts.length}
        />

        {selectedProducts.size > 0 && (
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="span" variant="bodyMd">
                {selectedProducts.size} prodotti selezionati
              </Text>
              <ButtonGroup>
                <Button onClick={handleBulkPublish}>Pubblica</Button>
                <Button onClick={handleBulkUnpublish}>Nascondi</Button>
                <Button onClick={handleBulkDelete} tone="critical">
                  Elimina
                </Button>
              </ButtonGroup>
            </InlineStack>
          </Card>
        )}

        <Card padding="0">
          <BlockStack gap="0">
            <Box padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      selectedProducts.size === paginatedProducts.length
                    }
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                  <Text as="span" variant="bodySm" tone="subdued">
                    Seleziona tutti
                  </Text>
                </InlineStack>
                <ButtonGroup variant="segmented">
                  <Button
                    pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                  >
                    Lista
                  </Button>
                  <Button
                    pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                  >
                    Griglia
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </Box>

            <Divider />

            {filteredProducts.length > 0 ? (
              viewMode === "list" ? (
                <DataTable
                  columnContentTypes={[
                    "text",
                    "text",
                    "text",
                    "text",
                    "numeric",
                    "text",
                  ]}
                  headings={[
                    "Prodotto",
                    "Stato",
                    "Inventario",
                    "Categoria",
                    "Prezzo",
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
                  <InlineGrid
                    columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                    gap="400"
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        selected={selectedProducts.has(product.id)}
                        onSelect={handleSelectProduct}
                        onDelete={handleDeleteProduct}
                        viewMode="grid"
                      />
                    ))}
                  </InlineGrid>
                </Box>
              )
            ) : (
              <Box padding="400">
                <EmptyState
                  heading="Nessun prodotto trovato"
                  action={{
                    content: "Aggiungi prodotto",
                    onAction: () => router.push("/prodotti/nuovo"),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>
                    {searchQuery || Object.values(filters).some((v) => v)
                      ? "Prova a modificare i filtri di ricerca"
                      : "Inizia ad aggiungere prodotti al tuo catalogo"}
                  </p>
                </EmptyState>
              </Box>
            )}
          </BlockStack>
        </Card>

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

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title="Elimina prodotto"
        primaryAction={{
          content: "Elimina",
          destructive: true,
          onAction: confirmDeleteProduct,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => {
              setDeleteModalOpen(false);
              setProductToDelete(null);
            },
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Sei sicuro di voler eliminare questo prodotto? Questa azione non puo
            essere annullata.
          </Text>
        </Modal.Section>
      </Modal>

      <Modal
        open={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        title="Elimina prodotti selezionati"
        primaryAction={{
          content: `Elimina ${selectedProducts.size} prodotti`,
          destructive: true,
          onAction: confirmBulkDelete,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setBulkDeleteModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Sei sicuro di voler eliminare {selectedProducts.size} prodotti?
            Questa azione non puo essere annullata.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
