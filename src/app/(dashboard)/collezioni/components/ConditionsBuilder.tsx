"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  Box,
  Divider,
  Banner,
  Badge,
  ButtonGroup,
} from "@shopify/polaris";
import {
  PlusIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import type {
  CollectionCondition,
  ConditionField,
  ConditionOperator,
  ConditionRelation,
} from "../types";
import { CONDITION_FIELDS, CONDITION_OPERATORS } from "../types";

interface ConditionsBuilderProps {
  conditions: CollectionCondition[];
  conditionRelation: ConditionRelation;
  onConditionsChange: (conditions: CollectionCondition[]) => void;
  onRelationChange: (relation: ConditionRelation) => void;
}

const generateId = () => `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function ConditionsBuilder({
  conditions,
  conditionRelation,
  onConditionsChange,
  onRelationChange,
}: ConditionsBuilderProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddCondition = useCallback(() => {
    const newCondition: CollectionCondition = {
      id: generateId(),
      field: "product_title",
      operator: "contains",
      value: "",
    };
    onConditionsChange([...conditions, newCondition]);
  }, [conditions, onConditionsChange]);

  const handleRemoveCondition = useCallback(
    (conditionId: string) => {
      onConditionsChange(conditions.filter((c) => c.id !== conditionId));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[conditionId];
        return newErrors;
      });
    },
    [conditions, onConditionsChange]
  );

  const handleFieldChange = useCallback(
    (conditionId: string, newField: ConditionField) => {
      const condition = conditions.find((c) => c.id === conditionId);
      if (!condition) return;

      const applicableOperators = CONDITION_OPERATORS.filter((op) =>
        op.applicableTo.includes(newField)
      );

      const currentOperatorValid = applicableOperators.some(
        (op) => op.value === condition.operator
      );

      const newOperator = currentOperatorValid
        ? condition.operator
        : applicableOperators[0]?.value || "equals";

      onConditionsChange(
        conditions.map((c) =>
          c.id === conditionId
            ? { ...c, field: newField, operator: newOperator }
            : c
        )
      );
    },
    [conditions, onConditionsChange]
  );

  const handleOperatorChange = useCallback(
    (conditionId: string, newOperator: ConditionOperator) => {
      onConditionsChange(
        conditions.map((c) =>
          c.id === conditionId ? { ...c, operator: newOperator } : c
        )
      );
    },
    [conditions, onConditionsChange]
  );

  const handleValueChange = useCallback(
    (conditionId: string, newValue: string) => {
      onConditionsChange(
        conditions.map((c) =>
          c.id === conditionId ? { ...c, value: newValue } : c
        )
      );

      if (errors[conditionId] && newValue.trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[conditionId];
          return newErrors;
        });
      }
    },
    [conditions, onConditionsChange, errors]
  );

  const validateConditions = useCallback(() => {
    const newErrors: Record<string, string> = {};

    conditions.forEach((condition) => {
      if (
        condition.operator !== "is_set" &&
        condition.operator !== "is_not_set" &&
        !condition.value.trim()
      ) {
        newErrors[condition.id] = "Il valore e obbligatorio";
      }

      if (
        (condition.field === "product_price" ||
          condition.field === "compare_at_price" ||
          condition.field === "inventory_stock" ||
          condition.field === "variant_weight") &&
        condition.value.trim() &&
        isNaN(Number(condition.value))
      ) {
        newErrors[condition.id] = "Inserisci un valore numerico";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [conditions]);

  const getOperatorsForField = useCallback((field: ConditionField) => {
    return CONDITION_OPERATORS.filter((op) => op.applicableTo.includes(field)).map(
      (op) => ({
        label: op.label,
        value: op.value,
      })
    );
  }, []);

  const fieldOptions = useMemo(
    () =>
      CONDITION_FIELDS.map((f) => ({
        label: f.label,
        value: f.value,
      })),
    []
  );

  const isNumericField = (field: ConditionField) =>
    ["product_price", "compare_at_price", "inventory_stock", "variant_weight"].includes(
      field
    );

  const needsValueInput = (operator: ConditionOperator) =>
    operator !== "is_set" && operator !== "is_not_set";

  const getFieldHelpText = (field: ConditionField) => {
    switch (field) {
      case "product_price":
      case "compare_at_price":
        return "Inserisci il prezzo in EUR";
      case "inventory_stock":
        return "Inserisci la quantita";
      case "variant_weight":
        return "Inserisci il peso in kg";
      case "product_tag":
        return "Inserisci il tag esatto";
      default:
        return "";
    }
  };

  const renderConditionRow = (condition: CollectionCondition, index: number) => {
    const operatorOptions = getOperatorsForField(condition.field);
    const showValueInput = needsValueInput(condition.operator);
    const isNumeric = isNumericField(condition.field);
    const helpText = getFieldHelpText(condition.field);
    const error = errors[condition.id];

    return (
      <div key={condition.id}>
        {index > 0 && (
          <Box paddingBlockStart="300" paddingBlockEnd="300">
            <InlineStack align="center" gap="200">
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--p-color-border-subdued)",
                }}
              />
              <Badge tone={conditionRelation === "all" ? "info" : "success"}>
                {conditionRelation === "all" ? "E" : "OPPURE"}
              </Badge>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--p-color-border-subdued)",
                }}
              />
            </InlineStack>
          </Box>
        )}

        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--p-color-bg-surface-secondary)",
            borderRadius: "8px",
            border: error ? "1px solid var(--p-color-border-critical)" : "none",
          }}
        >
          <BlockStack gap="300">
            <InlineStack gap="300" align="space-between" blockAlign="start">
              <div style={{ flex: 2 }}>
                <Select
                  label="Campo"
                  options={fieldOptions}
                  value={condition.field}
                  onChange={(value) =>
                    handleFieldChange(condition.id, value as ConditionField)
                  }
                />
              </div>

              <div style={{ flex: 2 }}>
                <Select
                  label="Operatore"
                  options={operatorOptions}
                  value={condition.operator}
                  onChange={(value) =>
                    handleOperatorChange(condition.id, value as ConditionOperator)
                  }
                />
              </div>

              {showValueInput && (
                <div style={{ flex: 2 }}>
                  <TextField
                    label="Valore"
                    value={condition.value}
                    onChange={(value) => handleValueChange(condition.id, value)}
                    type={isNumeric ? "number" : "text"}
                    helpText={helpText}
                    error={error}
                    autoComplete="off"
                  />
                </div>
              )}

              <div style={{ paddingTop: "24px" }}>
                <Button
                  icon={DeleteIcon}
                  variant="tertiary"
                  tone="critical"
                  onClick={() => handleRemoveCondition(condition.id)}
                  accessibilityLabel="Rimuovi condizione"
                />
              </div>
            </InlineStack>
          </BlockStack>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Condizioni
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              I prodotti devono soddisfare le seguenti condizioni
            </Text>
          </BlockStack>
        </InlineStack>

        <Divider />

        {conditions.length > 1 && (
          <InlineStack gap="200" blockAlign="center">
            <Text as="span" variant="bodyMd">
              I prodotti devono soddisfare
            </Text>
            <ButtonGroup variant="segmented">
              <Button
                pressed={conditionRelation === "all"}
                onClick={() => onRelationChange("all")}
              >
                Tutte le condizioni
              </Button>
              <Button
                pressed={conditionRelation === "any"}
                onClick={() => onRelationChange("any")}
              >
                Almeno una condizione
              </Button>
            </ButtonGroup>
          </InlineStack>
        )}

        {conditions.length > 0 ? (
          <BlockStack gap="200">
            {conditions.map((condition, index) =>
              renderConditionRow(condition, index)
            )}
          </BlockStack>
        ) : (
          <Banner tone="info">
            <p>
              Aggiungi condizioni per definire quali prodotti saranno inclusi
              automaticamente in questa collezione.
            </p>
          </Banner>
        )}

        <Button icon={PlusIcon} onClick={handleAddCondition}>
          Aggiungi condizione
        </Button>

        {conditions.length > 0 && (
          <>
            <Divider />
            <Box
              padding="300"
              background="bg-surface-secondary"
              borderRadius="200"
            >
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Anteprima logica
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {conditions.length === 1
                    ? `Prodotti dove ${getConditionText(conditions[0])}`
                    : `Prodotti dove ${conditions
                        .map(getConditionText)
                        .join(
                          conditionRelation === "all" ? " E " : " OPPURE "
                        )}`}
                </Text>
              </BlockStack>
            </Box>
          </>
        )}
      </BlockStack>
    </Card>
  );
}

function getConditionText(condition: CollectionCondition): string {
  const fieldLabel =
    CONDITION_FIELDS.find((f) => f.value === condition.field)?.label ||
    condition.field;
  const operatorLabel =
    CONDITION_OPERATORS.find((o) => o.value === condition.operator)?.label ||
    condition.operator;

  if (
    condition.operator === "is_set" ||
    condition.operator === "is_not_set"
  ) {
    return `${fieldLabel} ${operatorLabel.toLowerCase()}`;
  }

  return `${fieldLabel} ${operatorLabel.toLowerCase()} "${condition.value}"`;
}

export default ConditionsBuilder;
