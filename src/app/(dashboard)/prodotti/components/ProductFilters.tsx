"use client";

import { useCallback, useState } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  RangeSlider,
  Collapsible,
  Tag,
  Icon,
  Divider,
  Box,
  Filters,
  ChoiceList,
} from "@shopify/polaris";
import { FilterIcon, SearchIcon } from "@shopify/polaris-icons";
import type { ProductFiltersState } from "../types";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  STOCK_OPTIONS,
  SORT_OPTIONS,
} from "../types";

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  vendors: string[];
  totalResults: number;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  vendors,
  totalResults,
}: ProductFiltersProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const handleFilterChange = useCallback(
    (key: keyof ProductFiltersState, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handlePriceRangeChange = useCallback(
    (value: [number, number]) => {
      setPriceRange(value);
      onFiltersChange({
        ...filters,
        priceMin: value[0].toString(),
        priceMax: value[1].toString(),
      });
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      status: "",
      category: "",
      priceMin: "",
      priceMax: "",
      stockStatus: "",
      vendor: "",
      sortBy: "created_desc",
    });
    setPriceRange([0, 500]);
    onSearch("");
  }, [onFiltersChange, onSearch]);

  const statusOptions = [
    { label: "Tutti gli stati", value: "" },
    ...PRODUCT_STATUSES.map((s) => ({ label: s.label, value: s.value })),
  ];

  const categoryOptions = [
    { label: "Tutte le categorie", value: "" },
    ...PRODUCT_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
  ];

  const vendorOptions = [
    { label: "Tutti i venditori", value: "" },
    ...vendors.map((v) => ({ label: v, value: v })),
  ];

  const activeFiltersCount = [
    filters.status,
    filters.category,
    filters.stockStatus,
    filters.vendor,
    filters.priceMin,
    filters.priceMax,
  ].filter(Boolean).length;

  const getActiveFilterTags = () => {
    const tags: { key: string; label: string }[] = [];

    if (filters.status) {
      const status = PRODUCT_STATUSES.find((s) => s.value === filters.status);
      tags.push({ key: "status", label: `Stato: ${status?.label}` });
    }
    if (filters.category) {
      const category = PRODUCT_CATEGORIES.find(
        (c) => c.value === filters.category
      );
      tags.push({ key: "category", label: `Categoria: ${category?.label}` });
    }
    if (filters.stockStatus) {
      const stock = STOCK_OPTIONS.find((s) => s.value === filters.stockStatus);
      tags.push({ key: "stockStatus", label: `Stock: ${stock?.label}` });
    }
    if (filters.vendor) {
      tags.push({ key: "vendor", label: `Venditore: ${filters.vendor}` });
    }
    if (filters.priceMin || filters.priceMax) {
      tags.push({
        key: "price",
        label: `Prezzo: ${filters.priceMin || "0"} - ${filters.priceMax || "500"} EUR`,
      });
    }

    return tags;
  };

  const handleRemoveFilter = useCallback(
    (key: string) => {
      if (key === "price") {
        onFiltersChange({
          ...filters,
          priceMin: "",
          priceMax: "",
        });
        setPriceRange([0, 500]);
      } else {
        onFiltersChange({
          ...filters,
          [key]: "",
        });
      }
    },
    [filters, onFiltersChange]
  );

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="300" blockAlign="center">
            <div style={{ width: "300px" }}>
              <TextField
                label=""
                labelHidden
                value={searchQuery}
                onChange={onSearch}
                placeholder="Cerca prodotti..."
                prefix={<Icon source={SearchIcon} />}
                autoComplete="off"
                clearButton
                onClearButtonClick={() => onSearch("")}
              />
            </div>
            <Button
              icon={FilterIcon}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              pressed={filtersExpanded}
            >
              Filtri {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </InlineStack>

          <InlineStack gap="300" blockAlign="center">
            <Text as="span" variant="bodySm" tone="subdued">
              {totalResults} prodotti
            </Text>
            <div style={{ width: "200px" }}>
              <Select
                label=""
                labelHidden
                options={SORT_OPTIONS}
                value={filters.sortBy}
                onChange={(value) => handleFilterChange("sortBy", value)}
              />
            </div>
          </InlineStack>
        </InlineStack>

        {getActiveFilterTags().length > 0 && (
          <InlineStack gap="200" blockAlign="center">
            {getActiveFilterTags().map((tag) => (
              <Tag key={tag.key} onRemove={() => handleRemoveFilter(tag.key)}>
                {tag.label}
              </Tag>
            ))}
            {activeFiltersCount > 1 && (
              <Button onClick={handleClearFilters} variant="plain">
                Cancella tutti
              </Button>
            )}
          </InlineStack>
        )}

        <Collapsible
          open={filtersExpanded}
          id="product-filters-collapsible"
          transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
        >
          <Box paddingBlockStart="400">
            <Divider />
            <Box paddingBlockStart="400">
              <BlockStack gap="400">
                <InlineStack gap="400" align="start">
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Stato"
                      options={statusOptions}
                      value={filters.status}
                      onChange={(value) => handleFilterChange("status", value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Categoria"
                      options={categoryOptions}
                      value={filters.category}
                      onChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Disponibilita"
                      options={STOCK_OPTIONS}
                      value={filters.stockStatus}
                      onChange={(value) =>
                        handleFilterChange("stockStatus", value)
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Venditore"
                      options={vendorOptions}
                      value={filters.vendor}
                      onChange={(value) => handleFilterChange("vendor", value)}
                    />
                  </div>
                </InlineStack>

                <BlockStack gap="200">
                  <Text as="span" variant="bodySm" fontWeight="semibold">
                    Fascia di prezzo
                  </Text>
                  <RangeSlider
                    label="Prezzo"
                    labelHidden
                    value={priceRange}
                    min={0}
                    max={500}
                    step={10}
                    onChange={handlePriceRangeChange}
                    output
                    prefix={<Text as="span">{priceRange[0]} EUR</Text>}
                    suffix={<Text as="span">{priceRange[1]} EUR</Text>}
                  />
                </BlockStack>

                <InlineStack align="end">
                  <Button onClick={handleClearFilters} variant="plain">
                    Ripristina filtri
                  </Button>
                </InlineStack>
              </BlockStack>
            </Box>
          </Box>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}
