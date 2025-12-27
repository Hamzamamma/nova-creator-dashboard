"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Modal,
  ResourceList,
  ResourceItem,
  Thumbnail,
  Checkbox,
  Badge,
  Filters,
  ChoiceList,
  Box,
  Divider,
  EmptyState,
  Spinner,
} from "@shopify/polaris";
import {
  SearchIcon,
  PlusIcon,
  DeleteIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import type { CollectionProduct } from "../types";

interface ProductSelectorProps {
  selectedProducts: CollectionProduct[];
  onSelectionChange: (products: CollectionProduct[]) => void;
  availableProducts: CollectionProduct[];
  isLoading?: boolean;
}

export function ProductSelector({
  selectedProducts,
  onSelectionChange,
  availableProducts,
  isLoading = false,
}: ProductSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [vendorFilter, setVendorFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const openModal = useCallback(() => {
    setTempSelectedIds(selectedProducts.map((p) => p.id));
    setModalOpen(true);
  }, [selectedProducts]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSearchValue("");
    setVendorFilter([]);
    setTypeFilter([]);
  }, []);

  const handleConfirm = useCallback(() => {
    const newSelectedProducts = availableProducts.filter((p) =>
      tempSelectedIds.includes(p.id)
    );
    onSelectionChange(newSelectedProducts);
    closeModal();
  }, [tempSelectedIds, availableProducts, onSelectionChange, closeModal]);

  const handleProductToggle = useCallback(
    (productId: string) => {
      setTempSelectedIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    },
    []
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      onSelectionChange(selectedProducts.filter((p) => p.id !== productId));
    },
    [selectedProducts, onSelectionChange]
  );

  const handleSelectAll = useCallback(() => {
    const allIds = filteredProducts.map((p) => p.id);
    setTempSelectedIds(allIds);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setTempSelectedIds([]);
  }, []);

  const vendors = useMemo(() => {
    const uniqueVendors = [...new Set(availableProducts.map((p) => p.vendor))];
    return uniqueVendors.map((v) => ({ label: v, value: v }));
  }, [availableProducts]);

  const productTypes = useMemo(() => {
    const uniqueTypes = [...new Set(availableProducts.map((p) => p.type))];
    return uniqueTypes.map((t) => ({ label: t, value: t }));
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
      const matchesSearch =
        searchValue === "" ||
        product.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue.toLowerCase())
        );

      const matchesVendor =
        vendorFilter.length === 0 || vendorFilter.includes(product.vendor);

      const matchesType =
        typeFilter.length === 0 || typeFilter.includes(product.type);

      return matchesSearch && matchesVendor && matchesType;
    });
  }, [availableProducts, searchValue, vendorFilter, typeFilter]);

  const filters = [
    {
      key: "vendor",
      label: "Fornitore",
      filter: (
        <ChoiceList
          title="Fornitore"
          titleHidden
          choices={vendors}
          selected={vendorFilter}
          onChange={setVendorFilter}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "type",
      label: "Tipo prodotto",
      filter: (
        <ChoiceList
          title="Tipo prodotto"
          titleHidden
          choices={productTypes}
          selected={typeFilter}
          onChange={setTypeFilter}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [
    ...(vendorFilter.length > 0
      ? [
          {
            key: "vendor",
            label: `Fornitore: ${vendorFilter.join(", ")}`,
            onRemove: () => setVendorFilter([]),
          },
        ]
      : []),
    ...(typeFilter.length > 0
      ? [
          {
            key: "type",
            label: `Tipo: ${typeFilter.join(", ")}`,
            onRemove: () => setTypeFilter([]),
          },
        ]
      : []),
  ];

  const handleClearAll = useCallback(() => {
    setSearchValue("");
    setVendorFilter([]);
    setTypeFilter([]);
  }, []);

  const renderProductItem = (product: CollectionProduct) => {
    const isSelected = tempSelectedIds.includes(product.id);

    return (
      <ResourceItem
        id={product.id}
        onClick={() => handleProductToggle(product.id)}
        media={
          product.image ? (
            <Thumbnail source={product.image} alt={product.title} size="small" />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--p-color-bg-surface-secondary)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon width={20} height={20} />
            </div>
          )
        }
      >
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              {product.title}
            </Text>
            <InlineStack gap="200">
              <Text as="span" variant="bodySm" tone="subdued">
                {product.vendor}
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                EUR {product.price}
              </Text>
              <Badge
                tone={product.inventory > 10 ? "success" : product.inventory > 0 ? "warning" : "critical"}
              >
                {product.inventory} in stock
              </Badge>
            </InlineStack>
          </BlockStack>
          <Checkbox
            label=""
            labelHidden
            checked={isSelected}
            onChange={() => handleProductToggle(product.id)}
          />
        </InlineStack>
      </ResourceItem>
    );
  };

  const renderSelectedProduct = (product: CollectionProduct) => (
    <div
      key={product.id}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderBottom: "1px solid var(--p-color-border-subdued)",
      }}
    >
      {product.image ? (
        <Thumbnail source={product.image} alt={product.title} size="small" />
      ) : (
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "var(--p-color-bg-surface-secondary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageIcon width={20} height={20} />
        </div>
      )}
      <div style={{ flex: 1, marginLeft: "12px" }}>
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {product.title}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          {product.vendor} - EUR {product.price}
        </Text>
      </div>
      <Button
        icon={DeleteIcon}
        variant="tertiary"
        tone="critical"
        onClick={() => handleRemoveProduct(product.id)}
        accessibilityLabel={`Rimuovi ${product.title}`}
      />
    </div>
  );

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2" variant="headingMd">
              Prodotti
            </Text>
            <Button icon={PlusIcon} onClick={openModal}>
              Aggiungi prodotti
            </Button>
          </InlineStack>

          <Divider />

          {isLoading ? (
            <Box padding="800">
              <InlineStack align="center">
                <Spinner size="large" />
              </InlineStack>
            </Box>
          ) : selectedProducts.length > 0 ? (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {selectedProducts.map(renderSelectedProduct)}
            </div>
          ) : (
            <Box padding="400">
              <EmptyState
                heading="Nessun prodotto selezionato"
                image=""
              >
                <p>
                  Aggiungi prodotti a questa collezione cliccando il pulsante
                  sopra.
                </p>
              </EmptyState>
            </Box>
          )}

          {selectedProducts.length > 0 && (
            <>
              <Divider />
              <InlineStack align="space-between">
                <Text as="span" variant="bodySm" tone="subdued">
                  {selectedProducts.length} prodott{selectedProducts.length === 1 ? "o" : "i"} selezionat{selectedProducts.length === 1 ? "o" : "i"}
                </Text>
                <Button
                  variant="plain"
                  tone="critical"
                  onClick={() => onSelectionChange([])}
                >
                  Rimuovi tutti
                </Button>
              </InlineStack>
            </>
          )}
        </BlockStack>
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Seleziona prodotti"
        primaryAction={{
          content: `Aggiungi ${tempSelectedIds.length} prodott${tempSelectedIds.length === 1 ? "o" : "i"}`,
          onAction: handleConfirm,
          disabled: tempSelectedIds.length === 0,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: closeModal,
          },
        ]}
        large
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Filters
              queryValue={searchValue}
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={setSearchValue}
              onQueryClear={() => setSearchValue("")}
              onClearAll={handleClearAll}
              queryPlaceholder="Cerca prodotti..."
            />

            <InlineStack align="space-between">
              <Text as="span" variant="bodySm" tone="subdued">
                {filteredProducts.length} prodott{filteredProducts.length === 1 ? "o" : "i"} trovat{filteredProducts.length === 1 ? "o" : "i"}
              </Text>
              <InlineStack gap="200">
                <Button variant="plain" onClick={handleSelectAll}>
                  Seleziona tutti
                </Button>
                <Button variant="plain" onClick={handleDeselectAll}>
                  Deseleziona tutti
                </Button>
              </InlineStack>
            </InlineStack>

            <Divider />

            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {filteredProducts.length > 0 ? (
                <ResourceList
                  items={filteredProducts}
                  renderItem={renderProductItem}
                  resourceName={{ singular: "prodotto", plural: "prodotti" }}
                />
              ) : (
                <Box padding="800">
                  <BlockStack gap="200" inlineAlign="center">
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Nessun prodotto trovato
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Prova a modificare i filtri di ricerca
                    </Text>
                  </BlockStack>
                </Box>
              )}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}

export default ProductSelector;
