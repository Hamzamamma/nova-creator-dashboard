"use client";

import { useCallback, useState, useMemo } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Button,
  InlineGrid,
  Popover,
  ChoiceList,
  Tag,
  Box,
  Icon,
} from "@shopify/polaris";
import {
  SearchIcon,
  FilterIcon,
  XIcon,
} from "@shopify/polaris-icons";
import type { InventoryFiltersState, InventoryLocation } from "../types";
import {
  STOCK_STATUS_OPTIONS,
  INVENTORY_CATEGORIES,
  SORT_OPTIONS,
} from "../types";

interface InventoryFiltersProps {
  filters: InventoryFiltersState;
  onFiltersChange: (filters: InventoryFiltersState) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  locations: InventoryLocation[];
  vendors: string[];
  totalResults: number;
}

export default function InventoryFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  locations,
  vendors,
  totalResults,
}: InventoryFiltersProps) {
  const [filterPopoverActive, setFilterPopoverActive] = useState(false);

  const locationOptions = useMemo(() => {
    return [
      { label: "Tutte le posizioni", value: "" },
      ...locations.map((loc) => ({ label: loc.name, value: loc.id })),
    ];
  }, [locations]);

  const vendorOptions = useMemo(() => {
    return [
      { label: "Tutti i fornitori", value: "" },
      ...vendors.map((vendor) => ({ label: vendor, value: vendor })),
    ];
  }, [vendors]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.stockStatus) count++;
    if (filters.category) count++;
    if (filters.vendor) count++;
    return count;
  }, [filters]);

  const handleFilterChange = useCallback(
    (key: keyof InventoryFiltersState, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      location: "",
      stockStatus: "",
      category: "",
      vendor: "",
      sortBy: "updated_desc",
    });
    onSearch("");
  }, [onFiltersChange, onSearch]);

  const handleRemoveFilter = useCallback(
    (key: keyof InventoryFiltersState) => {
      onFiltersChange({ ...filters, [key]: "" });
    },
    [filters, onFiltersChange]
  );

  const getFilterLabel = (key: keyof InventoryFiltersState, value: string) => {
    switch (key) {
      case "location":
        const loc = locations.find((l) => l.id === value);
        return loc ? loc.name : value;
      case "stockStatus":
        const status = STOCK_STATUS_OPTIONS.find((s) => s.value === value);
        return status ? status.label : value;
      case "category":
        const cat = INVENTORY_CATEGORIES.find((c) => c.value === value);
        return cat ? cat.label : value;
      case "vendor":
        return value;
      default:
        return value;
    }
  };

  const activeTags = useMemo(() => {
    const tags: Array<{ key: keyof InventoryFiltersState; value: string }> = [];
    if (filters.location) tags.push({ key: "location", value: filters.location });
    if (filters.stockStatus) tags.push({ key: "stockStatus", value: filters.stockStatus });
    if (filters.category) tags.push({ key: "category", value: filters.category });
    if (filters.vendor) tags.push({ key: "vendor", value: filters.vendor });
    return tags;
  }, [filters]);

  return (
    <Card>
      <BlockStack gap="400">
        {/* Search and Quick Filters */}
        <InlineGrid columns={{ xs: 1, md: "2fr 1fr 1fr" }} gap="400">
          <TextField
            label=""
            placeholder="Cerca per nome, SKU, codice a barre..."
            value={searchQuery}
            onChange={onSearch}
            autoComplete="off"
            prefix={<Icon source={SearchIcon} tone="subdued" />}
            clearButton
            onClearButtonClick={() => onSearch("")}
          />

          <Select
            label=""
            options={STOCK_STATUS_OPTIONS}
            value={filters.stockStatus}
            onChange={(value) => handleFilterChange("stockStatus", value)}
            placeholder="Stato stock"
          />

          <Select
            label=""
            options={locationOptions}
            value={filters.location}
            onChange={(value) => handleFilterChange("location", value)}
            placeholder="Posizione"
          />
        </InlineGrid>

        {/* Advanced Filters */}
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="300" blockAlign="center">
            <Popover
              active={filterPopoverActive}
              activator={
                <Button
                  icon={FilterIcon}
                  onClick={() => setFilterPopoverActive(!filterPopoverActive)}
                  disclosure={filterPopoverActive ? "up" : "down"}
                >
                  Filtri avanzati
                  {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
                </Button>
              }
              onClose={() => setFilterPopoverActive(false)}
              preferredAlignment="left"
            >
              <Box padding="400" minWidth="320px">
                <BlockStack gap="400">
                  <Text as="h3" variant="headingSm">
                    Filtri Avanzati
                  </Text>

                  <Select
                    label="Categoria"
                    options={INVENTORY_CATEGORIES}
                    value={filters.category}
                    onChange={(value) => handleFilterChange("category", value)}
                  />

                  <Select
                    label="Fornitore"
                    options={vendorOptions}
                    value={filters.vendor}
                    onChange={(value) => handleFilterChange("vendor", value)}
                  />

                  <Select
                    label="Ordina per"
                    options={SORT_OPTIONS}
                    value={filters.sortBy}
                    onChange={(value) => handleFilterChange("sortBy", value)}
                  />

                  <InlineStack align="end">
                    <Button
                      variant="plain"
                      onClick={() => {
                        handleClearFilters();
                        setFilterPopoverActive(false);
                      }}
                    >
                      Cancella filtri
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Popover>

            <Select
              label=""
              options={SORT_OPTIONS}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              labelHidden
            />
          </InlineStack>

          <Text as="span" variant="bodySm" tone="subdued">
            {totalResults} risultati
          </Text>
        </InlineStack>

        {/* Active Filter Tags */}
        {(activeTags.length > 0 || searchQuery) && (
          <InlineStack gap="200" blockAlign="center">
            <Text as="span" variant="bodySm" tone="subdued">
              Filtri attivi:
            </Text>
            {searchQuery && (
              <Tag onRemove={() => onSearch("")}>Cerca: {searchQuery}</Tag>
            )}
            {activeTags.map((tag) => (
              <Tag key={tag.key} onRemove={() => handleRemoveFilter(tag.key)}>
                {getFilterLabel(tag.key, tag.value)}
              </Tag>
            ))}
            {(activeTags.length > 0 || searchQuery) && (
              <Button variant="plain" onClick={handleClearFilters}>
                Cancella tutti
              </Button>
            )}
          </InlineStack>
        )}
      </BlockStack>
    </Card>
  );
}
