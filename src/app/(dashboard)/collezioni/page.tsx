"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  InlineGrid,
  Badge,
  Button,
  TextField,
  Select,
  Popover,
  ActionList,
  Modal,
  Checkbox,
  Divider,
  Icon,
  Spinner,
  EmptyState,
  Filters,
  ChoiceList,
  Box,
  Banner,
} from "@shopify/polaris";
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  SortIcon,
  CollectionIcon,
  DeleteIcon,
  EyeCheckMarkIcon,
  ListBulletedIcon,
  HashtagIcon,
} from "@shopify/polaris-icons";
import { CollectionCard } from "./components/CollectionCard";
import type { Collection, CollectionStats } from "./types";
import collectionsData from "./data.json";

type ViewMode = "grid" | "list";
type SortField = "title" | "productsCount" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function CollezioniPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCollections(collectionsData.collections as Collection[]);
      setLoading(false);
    };
    loadCollections();
  }, []);

  const stats: CollectionStats = useMemo(() => {
    const automatedCount = collections.filter(
      (c) => c.type === "automated"
    ).length;
    const totalProducts = collections.reduce(
      (sum, c) => sum + c.productsCount,
      0
    );

    return {
      totalCollections: collections.length,
      totalProductsInCollections: totalProducts,
      automatedCollections: automatedCount,
      manualCollections: collections.length - automatedCount,
    };
  }, [collections]);

  const filteredAndSortedCollections = useMemo(() => {
    let result = [...collections];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    if (typeFilter.length > 0) {
      result = result.filter((c) => typeFilter.includes(c.type));
    }

    if (statusFilter.length > 0) {
      result = result.filter((c) => {
        if (statusFilter.includes("published") && c.isPublished) return true;
        if (statusFilter.includes("draft") && !c.isPublished) return true;
        return false;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "productsCount":
          comparison = a.productsCount - b.productsCount;
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [collections, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleSortChange = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
      setSortPopoverActive(false);
    },
    [sortField]
  );

  const handleSelectCollection = useCallback((id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedCollections.length === filteredAndSortedCollections.length) {
      setSelectedCollections([]);
    } else {
      setSelectedCollections(filteredAndSortedCollections.map((c) => c.id));
    }
  }, [selectedCollections, filteredAndSortedCollections]);

  const handleDeleteSelected = useCallback(() => {
    setCollections((prev) =>
      prev.filter((c) => !selectedCollections.includes(c.id))
    );
    setSelectedCollections([]);
    setDeleteModalOpen(false);
  }, [selectedCollections]);

  const handleDeleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleDuplicateCollection = useCallback(
    (id: string) => {
      const original = collections.find((c) => c.id === id);
      if (!original) return;

      const duplicate: Collection = {
        ...original,
        id: `col-${Date.now()}`,
        title: `${original.title} (copia)`,
        seo: {
          ...original.seo,
          urlHandle: `${original.seo.urlHandle}-copia`,
        },
        isPublished: false,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCollections((prev) => [duplicate, ...prev]);
    },
    [collections]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setTypeFilter([]);
    setStatusFilter([]);
  }, []);

  const filters = [
    {
      key: "type",
      label: "Tipo",
      filter: (
        <ChoiceList
          title="Tipo collezione"
          titleHidden
          choices={[
            { label: "Manuale", value: "manual" },
            { label: "Automatica", value: "automated" },
          ]}
          selected={typeFilter}
          onChange={setTypeFilter}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "status",
      label: "Stato",
      filter: (
        <ChoiceList
          title="Stato pubblicazione"
          titleHidden
          choices={[
            { label: "Pubblicata", value: "published" },
            { label: "Bozza", value: "draft" },
          ]}
          selected={statusFilter}
          onChange={setStatusFilter}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [
    ...(typeFilter.length > 0
      ? [
          {
            key: "type",
            label: `Tipo: ${typeFilter
              .map((t) => (t === "manual" ? "Manuale" : "Automatica"))
              .join(", ")}`,
            onRemove: () => setTypeFilter([]),
          },
        ]
      : []),
    ...(statusFilter.length > 0
      ? [
          {
            key: "status",
            label: `Stato: ${statusFilter
              .map((s) => (s === "published" ? "Pubblicata" : "Bozza"))
              .join(", ")}`,
            onRemove: () => setStatusFilter([]),
          },
        ]
      : []),
  ];

  const sortOptions = [
    { label: "Nome", value: "title" },
    { label: "Numero prodotti", value: "productsCount" },
    { label: "Data creazione", value: "createdAt" },
    { label: "Ultima modifica", value: "updatedAt" },
  ];

  const statsCards = [
    {
      title: "Totale collezioni",
      value: stats.totalCollections,
      icon: CollectionIcon,
    },
    {
      title: "Prodotti totali",
      value: stats.totalProductsInCollections,
      icon: EyeCheckMarkIcon,
    },
    {
      title: "Automatiche",
      value: stats.automatedCollections,
      icon: FilterIcon,
    },
    {
      title: "Manuali",
      value: stats.manualCollections,
      icon: ListBulletedIcon,
    },
  ];

  if (loading) {
    return (
      <Page title="Collezioni">
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
      title="Collezioni"
      subtitle="Organizza i tuoi prodotti in collezioni"
      primaryAction={{
        content: "Crea collezione",
        icon: PlusIcon,
        onAction: () => router.push("/collezioni/nuovo"),
      }}
      secondaryActions={[
        {
          content: "Esporta",
          onAction: () => console.log("Esporta"),
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
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Bulk Actions Banner */}
        {selectedCollections.length > 0 && (
          <Banner
            title={`${selectedCollections.length} collezion${
              selectedCollections.length === 1 ? "e selezionata" : "i selezionate"
            }`}
            tone="info"
            onDismiss={() => setSelectedCollections([])}
          >
            <InlineStack gap="200">
              <Button
                tone="critical"
                onClick={() => setDeleteModalOpen(true)}
                icon={DeleteIcon}
              >
                Elimina selezionate
              </Button>
            </InlineStack>
          </Banner>
        )}

        {/* Filters and Search */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">
                Tutte le collezioni
              </Text>
              <InlineStack gap="200">
                <Popover
                  active={sortPopoverActive}
                  activator={
                    <Button
                      icon={SortIcon}
                      onClick={() => setSortPopoverActive(!sortPopoverActive)}
                      disclosure
                    >
                      Ordina
                    </Button>
                  }
                  onClose={() => setSortPopoverActive(false)}
                >
                  <ActionList
                    items={sortOptions.map((opt) => ({
                      content: opt.label,
                      active: sortField === opt.value,
                      suffix:
                        sortField === opt.value ? (
                          <Badge>{sortDirection === "asc" ? "A-Z" : "Z-A"}</Badge>
                        ) : null,
                      onAction: () => handleSortChange(opt.value as SortField),
                    }))}
                  />
                </Popover>

                <Button
                  icon={HashtagIcon}
                  pressed={viewMode === "grid"}
                  onClick={() => handleViewModeChange("grid")}
                  accessibilityLabel="Vista griglia"
                />
                <Button
                  icon={ListBulletedIcon}
                  pressed={viewMode === "list"}
                  onClick={() => handleViewModeChange("list")}
                  accessibilityLabel="Vista lista"
                />
              </InlineStack>
            </InlineStack>

            <Filters
              queryValue={searchQuery}
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={handleSearchChange}
              onQueryClear={() => setSearchQuery("")}
              onClearAll={handleClearFilters}
              queryPlaceholder="Cerca collezioni..."
            />

            <Divider />

            {/* Select All Checkbox */}
            {filteredAndSortedCollections.length > 0 && (
              <InlineStack align="space-between" blockAlign="center">
                <Checkbox
                  label={`Seleziona tutte (${filteredAndSortedCollections.length})`}
                  checked={
                    selectedCollections.length ===
                    filteredAndSortedCollections.length
                  }
                  onChange={handleSelectAll}
                />
                <Text as="span" variant="bodySm" tone="subdued">
                  {filteredAndSortedCollections.length} collezion
                  {filteredAndSortedCollections.length === 1 ? "e" : "i"}
                </Text>
              </InlineStack>
            )}

            {/* Collections Grid/List */}
            {filteredAndSortedCollections.length > 0 ? (
              viewMode === "grid" ? (
                <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="400">
                  {filteredAndSortedCollections.map((collection) => (
                    <div key={collection.id} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          zIndex: 10,
                        }}
                      >
                        <Checkbox
                          label=""
                          labelHidden
                          checked={selectedCollections.includes(collection.id)}
                          onChange={() => handleSelectCollection(collection.id)}
                        />
                      </div>
                      <CollectionCard
                        collection={collection}
                        onDelete={handleDeleteCollection}
                        onDuplicate={handleDuplicateCollection}
                        viewMode="grid"
                      />
                    </div>
                  ))}
                </InlineGrid>
              ) : (
                <div
                  style={{
                    border: "1px solid var(--p-color-border-subdued)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {filteredAndSortedCollections.map((collection) => (
                    <div
                      key={collection.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ padding: "12px 16px" }}>
                        <Checkbox
                          label=""
                          labelHidden
                          checked={selectedCollections.includes(collection.id)}
                          onChange={() => handleSelectCollection(collection.id)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <CollectionCard
                          collection={collection}
                          onDelete={handleDeleteCollection}
                          onDuplicate={handleDuplicateCollection}
                          viewMode="list"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <EmptyState
                heading="Nessuna collezione trovata"
                action={{
                  content: "Crea collezione",
                  onAction: () => router.push("/collezioni/nuovo"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>
                  {searchQuery || typeFilter.length > 0 || statusFilter.length > 0
                    ? "Prova a modificare i filtri di ricerca"
                    : "Crea la tua prima collezione per organizzare i prodotti"}
                </p>
              </EmptyState>
            )}
          </BlockStack>
        </Card>
      </BlockStack>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Elimina collezioni"
        primaryAction={{
          content: "Elimina",
          destructive: true,
          onAction: handleDeleteSelected,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setDeleteModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Sei sicuro di voler eliminare {selectedCollections.length} collezion
            {selectedCollections.length === 1 ? "e" : "i"}? Questa azione non
            puo essere annullata.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
