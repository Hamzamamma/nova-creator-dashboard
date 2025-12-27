"use client";

import { useState, useCallback } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  DataTable,
  Modal,
  FormLayout,
  Checkbox,
  Tag,
  Icon,
  Divider,
  Box,
  Banner,
} from "@shopify/polaris";
import { PlusIcon, DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import type { ProductVariantFormData, ProductVariantOption } from "../types";

interface VariantOption {
  name: string;
  values: string[];
}

interface VariantsManagerProps {
  variants: ProductVariantFormData[];
  onVariantsChange: (variants: ProductVariantFormData[]) => void;
  basePrice: string;
  baseSku: string;
}

const DEFAULT_OPTION_TYPES = [
  { label: "Taglia", value: "Taglia" },
  { label: "Colore", value: "Colore" },
  { label: "Materiale", value: "Materiale" },
  { label: "Stile", value: "Stile" },
];

export default function VariantsManager({
  variants,
  onVariantsChange,
  basePrice,
  baseSku,
}: VariantsManagerProps) {
  const [hasVariants, setHasVariants] = useState(variants.length > 0);
  const [options, setOptions] = useState<VariantOption[]>([
    { name: "Taglia", values: [] },
  ]);
  const [newOptionValue, setNewOptionValue] = useState<{ [key: number]: string }>(
    {}
  );
  const [editingVariant, setEditingVariant] =
    useState<ProductVariantFormData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const generateVariants = useCallback(() => {
    const activeOptions = options.filter((opt) => opt.values.length > 0);
    if (activeOptions.length === 0) {
      onVariantsChange([]);
      return;
    }

    const combinations: ProductVariantOption[][] = [];

    const generateCombinations = (
      current: ProductVariantOption[],
      optionIndex: number
    ) => {
      if (optionIndex === activeOptions.length) {
        combinations.push([...current]);
        return;
      }

      const option = activeOptions[optionIndex];
      for (const value of option.values) {
        current.push({ name: option.name, value });
        generateCombinations(current, optionIndex + 1);
        current.pop();
      }
    };

    generateCombinations([], 0);

    const newVariants: ProductVariantFormData[] = combinations.map(
      (combo, index) => {
        const title = combo.map((c) => c.value).join(" / ");
        const skuSuffix = combo
          .map((c) => c.value.substring(0, 2).toUpperCase())
          .join("-");

        const existingVariant = variants.find(
          (v) =>
            v.options.length === combo.length &&
            v.options.every(
              (opt, i) =>
                opt.name === combo[i].name && opt.value === combo[i].value
            )
        );

        if (existingVariant) {
          return existingVariant;
        }

        return {
          id: `var_new_${Date.now()}_${index}`,
          title,
          sku: baseSku ? `${baseSku}-${skuSuffix}` : "",
          barcode: "",
          price: basePrice,
          compareAtPrice: "",
          costPerItem: "",
          quantity: "0",
          options: combo,
        };
      }
    );

    onVariantsChange(newVariants);
  }, [options, variants, basePrice, baseSku, onVariantsChange]);

  const handleAddOption = useCallback(() => {
    if (options.length < 3) {
      const usedNames = options.map((o) => o.name);
      const availableOption = DEFAULT_OPTION_TYPES.find(
        (t) => !usedNames.includes(t.value)
      );
      setOptions([
        ...options,
        { name: availableOption?.value || "Opzione", values: [] },
      ]);
    }
  }, [options]);

  const handleRemoveOption = useCallback(
    (index: number) => {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      setTimeout(generateVariants, 0);
    },
    [options, generateVariants]
  );

  const handleOptionNameChange = useCallback(
    (index: number, name: string) => {
      const newOptions = [...options];
      newOptions[index].name = name;
      setOptions(newOptions);
    },
    [options]
  );

  const handleAddOptionValue = useCallback(
    (index: number) => {
      const value = newOptionValue[index]?.trim();
      if (!value) return;

      const newOptions = [...options];
      if (!newOptions[index].values.includes(value)) {
        newOptions[index].values.push(value);
        setOptions(newOptions);
        setNewOptionValue({ ...newOptionValue, [index]: "" });
        setTimeout(generateVariants, 0);
      }
    },
    [options, newOptionValue, generateVariants]
  );

  const handleRemoveOptionValue = useCallback(
    (optionIndex: number, valueIndex: number) => {
      const newOptions = [...options];
      newOptions[optionIndex].values.splice(valueIndex, 1);
      setOptions(newOptions);
      setTimeout(generateVariants, 0);
    },
    [options, generateVariants]
  );

  const handleVariantEdit = useCallback((variant: ProductVariantFormData) => {
    setEditingVariant({ ...variant });
    setModalOpen(true);
  }, []);

  const handleVariantSave = useCallback(() => {
    if (!editingVariant) return;

    const newVariants = variants.map((v) =>
      v.id === editingVariant.id ? editingVariant : v
    );
    onVariantsChange(newVariants);
    setModalOpen(false);
    setEditingVariant(null);
  }, [editingVariant, variants, onVariantsChange]);

  const handleVariantDelete = useCallback(
    (variantId: string) => {
      const newVariants = variants.filter((v) => v.id !== variantId);
      onVariantsChange(newVariants);
    },
    [variants, onVariantsChange]
  );

  const handleToggleVariants = useCallback(
    (checked: boolean) => {
      setHasVariants(checked);
      if (!checked) {
        onVariantsChange([]);
        setOptions([{ name: "Taglia", values: [] }]);
      }
    },
    [onVariantsChange]
  );

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "-";
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  };

  const tableRows = variants.map((variant) => [
    variant.title,
    variant.sku || "-",
    formatPrice(variant.price),
    variant.quantity,
    <InlineStack gap="200" key={variant.id}>
      <Button
        icon={EditIcon}
        onClick={() => handleVariantEdit(variant)}
        variant="plain"
        size="slim"
      />
      <Button
        icon={DeleteIcon}
        onClick={() => handleVariantDelete(variant.id)}
        variant="plain"
        tone="critical"
        size="slim"
      />
    </InlineStack>,
  ]);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text as="h2" variant="headingMd">
            Varianti
          </Text>
          <Checkbox
            label="Questo prodotto ha varianti"
            checked={hasVariants}
            onChange={handleToggleVariants}
          />
        </InlineStack>

        {hasVariants && (
          <>
            <Divider />

            <BlockStack gap="400">
              <Text as="h3" variant="headingSm">
                Opzioni
              </Text>

              {options.map((option, optionIndex) => (
                <Card key={optionIndex}>
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <div style={{ width: "200px" }}>
                        <TextField
                          label="Nome opzione"
                          labelHidden
                          value={option.name}
                          onChange={(value) =>
                            handleOptionNameChange(optionIndex, value)
                          }
                          autoComplete="off"
                          placeholder="es. Taglia, Colore"
                        />
                      </div>
                      {options.length > 1 && (
                        <Button
                          icon={DeleteIcon}
                          onClick={() => handleRemoveOption(optionIndex)}
                          variant="plain"
                          tone="critical"
                        />
                      )}
                    </InlineStack>

                    <InlineStack gap="200" blockAlign="center">
                      <div style={{ flex: 1 }}>
                        <TextField
                          label="Aggiungi valore"
                          labelHidden
                          value={newOptionValue[optionIndex] || ""}
                          onChange={(value) =>
                            setNewOptionValue({
                              ...newOptionValue,
                              [optionIndex]: value,
                            })
                          }
                          autoComplete="off"
                          placeholder="es. S, M, L, XL"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddOptionValue(optionIndex);
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => handleAddOptionValue(optionIndex)}
                        disabled={!newOptionValue[optionIndex]?.trim()}
                      >
                        Aggiungi
                      </Button>
                    </InlineStack>

                    {option.values.length > 0 && (
                      <InlineStack gap="200">
                        {option.values.map((value, valueIndex) => (
                          <Tag
                            key={valueIndex}
                            onRemove={() =>
                              handleRemoveOptionValue(optionIndex, valueIndex)
                            }
                          >
                            {value}
                          </Tag>
                        ))}
                      </InlineStack>
                    )}
                  </BlockStack>
                </Card>
              ))}

              {options.length < 3 && (
                <Button icon={PlusIcon} onClick={handleAddOption}>
                  Aggiungi altra opzione
                </Button>
              )}
            </BlockStack>

            {variants.length > 0 && (
              <>
                <Divider />

                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">
                      Varianti ({variants.length})
                    </Text>
                  </InlineStack>

                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "numeric",
                      "numeric",
                      "text",
                    ]}
                    headings={["Variante", "SKU", "Prezzo", "Quantita", "Azioni"]}
                    rows={tableRows}
                  />
                </BlockStack>
              </>
            )}

            {variants.length === 0 &&
              options.some((opt) => opt.values.length > 0) && (
                <Banner tone="info">
                  <p>
                    Aggiungi valori alle opzioni per generare automaticamente le
                    varianti del prodotto.
                  </p>
                </Banner>
              )}
          </>
        )}
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVariant(null);
        }}
        title={`Modifica variante: ${editingVariant?.title}`}
        primaryAction={{
          content: "Salva",
          onAction: handleVariantSave,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => {
              setModalOpen(false);
              setEditingVariant(null);
            },
          },
        ]}
      >
        <Modal.Section>
          {editingVariant && (
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Prezzo"
                  type="number"
                  value={editingVariant.price}
                  onChange={(value) =>
                    setEditingVariant({ ...editingVariant, price: value })
                  }
                  prefix="EUR"
                  autoComplete="off"
                />
                <TextField
                  label="Prezzo originale"
                  type="number"
                  value={editingVariant.compareAtPrice}
                  onChange={(value) =>
                    setEditingVariant({
                      ...editingVariant,
                      compareAtPrice: value,
                    })
                  }
                  prefix="EUR"
                  autoComplete="off"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Costo per articolo"
                  type="number"
                  value={editingVariant.costPerItem}
                  onChange={(value) =>
                    setEditingVariant({ ...editingVariant, costPerItem: value })
                  }
                  prefix="EUR"
                  autoComplete="off"
                  helpText="Il costo non sara visibile ai clienti"
                />
                <TextField
                  label="Quantita"
                  type="number"
                  value={editingVariant.quantity}
                  onChange={(value) =>
                    setEditingVariant({ ...editingVariant, quantity: value })
                  }
                  autoComplete="off"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="SKU"
                  value={editingVariant.sku}
                  onChange={(value) =>
                    setEditingVariant({ ...editingVariant, sku: value })
                  }
                  autoComplete="off"
                />
                <TextField
                  label="Codice a barre"
                  value={editingVariant.barcode}
                  onChange={(value) =>
                    setEditingVariant({ ...editingVariant, barcode: value })
                  }
                  autoComplete="off"
                />
              </FormLayout.Group>
            </FormLayout>
          )}
        </Modal.Section>
      </Modal>
    </Card>
  );
}
