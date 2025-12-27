"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Popover,
  Button,
  ActionList,
  Text,
  BlockStack,
  InlineStack,
  Box,
  TextField,
  Card,
  DatePicker,
  Icon,
} from "@shopify/polaris";
import { CalendarIcon, ChevronDownIcon } from "@shopify/polaris-icons";
import type { DateRange, DateRangePreset } from "../types";

interface DateRangePickerProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  presets?: DateRangePreset[];
  showComparison?: boolean;
  comparisonRange?: DateRange;
  onComparisonChange?: (range: DateRange) => void;
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  "today",
  "yesterday",
  "last7days",
  "last30days",
  "thisMonth",
  "lastMonth",
  "thisYear",
];

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Oggi",
  yesterday: "Ieri",
  last7days: "Ultimi 7 giorni",
  last30days: "Ultimi 30 giorni",
  thisMonth: "Questo mese",
  lastMonth: "Mese scorso",
  thisYear: "Quest'anno",
  custom: "Personalizzato",
};

function getPresetDateRange(preset: DateRangePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today":
      return {
        start: today,
        end: today,
        label: PRESET_LABELS.today,
      };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: yesterday,
        end: yesterday,
        label: PRESET_LABELS.yesterday,
      };
    }
    case "last7days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return {
        start,
        end: today,
        label: PRESET_LABELS.last7days,
      };
    }
    case "last30days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return {
        start,
        end: today,
        label: PRESET_LABELS.last30days,
      };
    }
    case "thisMonth": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start,
        end: today,
        label: PRESET_LABELS.thisMonth,
      };
    }
    case "lastMonth": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        start,
        end,
        label: PRESET_LABELS.lastMonth,
      };
    }
    case "thisYear": {
      const start = new Date(today.getFullYear(), 0, 1);
      return {
        start,
        end: today,
        label: PRESET_LABELS.thisYear,
      };
    }
    default:
      return {
        start: today,
        end: today,
        label: PRESET_LABELS.custom,
      };
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(range: DateRange): string {
  if (range.label !== "Personalizzato") {
    return range.label;
  }
  return `${formatDate(range.start)} - ${formatDate(range.end)}`;
}

export function DateRangePicker({
  selectedRange,
  onRangeChange,
  presets = DEFAULT_PRESETS,
  showComparison = false,
  comparisonRange,
  onComparisonChange,
}: DateRangePickerProps) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date>(selectedRange.start);
  const [tempEndDate, setTempEndDate] = useState<Date>(selectedRange.end);
  const [{ month, year }, setDate] = useState({
    month: selectedRange.start.getMonth(),
    year: selectedRange.start.getFullYear(),
  });

  const togglePopover = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const handlePresetSelect = useCallback(
    (preset: DateRangePreset) => {
      if (preset === "custom") {
        setShowCustomPicker(true);
        return;
      }
      const range = getPresetDateRange(preset);
      onRangeChange(range);
      setPopoverActive(false);
      setShowCustomPicker(false);
    },
    [onRangeChange]
  );

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  const handleDateSelection = useCallback(
    (range: { start: Date; end: Date }) => {
      setTempStartDate(range.start);
      setTempEndDate(range.end);
    },
    []
  );

  const applyCustomRange = useCallback(() => {
    onRangeChange({
      start: tempStartDate,
      end: tempEndDate,
      label: "Personalizzato",
    });
    setPopoverActive(false);
    setShowCustomPicker(false);
  }, [tempStartDate, tempEndDate, onRangeChange]);

  const cancelCustomRange = useCallback(() => {
    setTempStartDate(selectedRange.start);
    setTempEndDate(selectedRange.end);
    setShowCustomPicker(false);
  }, [selectedRange]);

  const presetItems = useMemo(
    () =>
      presets.map((preset) => ({
        content: PRESET_LABELS[preset],
        onAction: () => handlePresetSelect(preset),
        active: selectedRange.label === PRESET_LABELS[preset],
      })),
    [presets, selectedRange.label, handlePresetSelect]
  );

  const activator = (
    <Button
      onClick={togglePopover}
      disclosure="down"
      icon={CalendarIcon}
    >
      {formatDateRange(selectedRange)}
    </Button>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopover}
      preferredAlignment="right"
      sectioned
    >
      {showCustomPicker ? (
        <Box padding="400" minWidth="320px">
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Seleziona intervallo
            </Text>

            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Data inizio"
                  value={formatDate(tempStartDate)}
                  onChange={() => {}}
                  autoComplete="off"
                  readOnly
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Data fine"
                  value={formatDate(tempEndDate)}
                  onChange={() => {}}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>

            <DatePicker
              month={month}
              year={year}
              onChange={handleDateSelection}
              onMonthChange={handleMonthChange}
              selected={{
                start: tempStartDate,
                end: tempEndDate,
              }}
              allowRange
            />

            <InlineStack gap="200" align="end">
              <Button onClick={cancelCustomRange}>Annulla</Button>
              <Button variant="primary" onClick={applyCustomRange}>
                Applica
              </Button>
            </InlineStack>
          </BlockStack>
        </Box>
      ) : (
        <Box minWidth="200px">
          <ActionList
            items={[
              ...presetItems,
              {
                content: "Personalizzato...",
                onAction: () => setShowCustomPicker(true),
              },
            ]}
          />
          {showComparison && comparisonRange && (
            <Box
              paddingBlock="300"
              paddingInline="400"
              borderBlockStartWidth="025"
              borderColor="border"
            >
              <BlockStack gap="200">
                <Text as="span" variant="bodySm" tone="subdued">
                  Confronto con:
                </Text>
                <Text as="span" variant="bodySm" fontWeight="medium">
                  {formatDateRange(comparisonRange)}
                </Text>
              </BlockStack>
            </Box>
          )}
        </Box>
      )}
    </Popover>
  );
}

// Quick date range buttons for inline use
export function DateRangeButtons({
  selectedPreset,
  onPresetChange,
  presets = ["today", "last7days", "last30days", "thisMonth"],
}: {
  selectedPreset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  presets?: DateRangePreset[];
}) {
  return (
    <InlineStack gap="200" wrap={false}>
      {presets.map((preset) => (
        <Button
          key={preset}
          pressed={selectedPreset === preset}
          onClick={() => onPresetChange(preset)}
          size="slim"
        >
          {PRESET_LABELS[preset]}
        </Button>
      ))}
    </InlineStack>
  );
}

// Hook for managing date range state
export function useDateRange(initialPreset: DateRangePreset = "last30days") {
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getPresetDateRange(initialPreset)
  );
  const [currentPreset, setCurrentPreset] =
    useState<DateRangePreset>(initialPreset);

  const setPreset = useCallback((preset: DateRangePreset) => {
    setCurrentPreset(preset);
    setDateRange(getPresetDateRange(preset));
  }, []);

  const setCustomRange = useCallback((start: Date, end: Date) => {
    setCurrentPreset("custom");
    setDateRange({
      start,
      end,
      label: "Personalizzato",
    });
  }, []);

  const comparisonRange = useMemo((): DateRange => {
    const duration =
      dateRange.end.getTime() - dateRange.start.getTime();
    const daysCount = Math.ceil(duration / (1000 * 60 * 60 * 24)) + 1;

    const compEnd = new Date(dateRange.start);
    compEnd.setDate(compEnd.getDate() - 1);

    const compStart = new Date(compEnd);
    compStart.setDate(compStart.getDate() - daysCount + 1);

    return {
      start: compStart,
      end: compEnd,
      label: "Periodo precedente",
    };
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    currentPreset,
    setPreset,
    setCustomRange,
    comparisonRange,
  };
}

export { getPresetDateRange, formatDate, formatDateRange, PRESET_LABELS };
export default DateRangePicker;
