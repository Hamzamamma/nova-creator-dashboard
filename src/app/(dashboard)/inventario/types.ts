// TypeScript interfaces for Inventory management system

export interface InventoryLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface StockByLocation {
  locationId: string;
  locationName: string;
  quantity: number;
  reserved: number;
  available: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  barcode: string;
  category: string;
  vendor: string;
  price: number;
  costPerItem: number | null;
  totalQuantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  reorderQuantity: number;
  stockByLocation: StockByLocation[];
  trackQuantity: boolean;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastStockUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = "received" | "sold" | "adjusted" | "transferred" | "returned" | "damaged";

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  productTitle: string;
  sku: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  fromLocationId: string | null;
  fromLocationName: string | null;
  toLocationId: string | null;
  toLocationName: string | null;
  reason: string;
  reference: string | null;
  orderId: string | null;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface InventoryAlert {
  id: string;
  inventoryItemId: string;
  productTitle: string;
  sku: string;
  type: "low_stock" | "out_of_stock" | "overstock";
  currentQuantity: number;
  threshold: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  totalUnits: number;
  alertsCount: number;
}

export interface InventoryFiltersState {
  location: string;
  stockStatus: string;
  category: string;
  vendor: string;
  sortBy: string;
}

export interface StockAdjustmentForm {
  quantity: number;
  adjustmentType: "set" | "add" | "remove";
  locationId: string;
  reason: string;
  reference: string;
}

export const STOCK_STATUS_OPTIONS = [
  { label: "Tutti", value: "" },
  { label: "Disponibile", value: "in_stock" },
  { label: "Scorte basse", value: "low_stock" },
  { label: "Esaurito", value: "out_of_stock" },
];

export const MOVEMENT_TYPE_OPTIONS = [
  { label: "Tutti", value: "" },
  { label: "Ricevuto", value: "received" },
  { label: "Venduto", value: "sold" },
  { label: "Rettificato", value: "adjusted" },
  { label: "Trasferito", value: "transferred" },
  { label: "Reso", value: "returned" },
  { label: "Danneggiato", value: "damaged" },
];

export const ADJUSTMENT_TYPE_OPTIONS = [
  { label: "Imposta quantita", value: "set" },
  { label: "Aggiungi", value: "add" },
  { label: "Rimuovi", value: "remove" },
];

export const ADJUSTMENT_REASON_OPTIONS = [
  { label: "Conteggio inventario", value: "inventory_count" },
  { label: "Ricezione merce", value: "goods_received" },
  { label: "Reso cliente", value: "customer_return" },
  { label: "Prodotto danneggiato", value: "damaged" },
  { label: "Furto/Perdita", value: "theft_loss" },
  { label: "Correzione errore", value: "error_correction" },
  { label: "Trasferimento", value: "transfer" },
  { label: "Altro", value: "other" },
];

export const SORT_OPTIONS = [
  { label: "Quantita (basso-alto)", value: "quantity_asc" },
  { label: "Quantita (alto-basso)", value: "quantity_desc" },
  { label: "Nome (A-Z)", value: "title_asc" },
  { label: "Nome (Z-A)", value: "title_desc" },
  { label: "SKU (A-Z)", value: "sku_asc" },
  { label: "SKU (Z-A)", value: "sku_desc" },
  { label: "Valore (basso-alto)", value: "value_asc" },
  { label: "Valore (alto-basso)", value: "value_desc" },
  { label: "Ultimo aggiornamento", value: "updated_desc" },
];

export const INVENTORY_CATEGORIES = [
  { label: "Tutte", value: "" },
  { label: "Abbigliamento", value: "abbigliamento" },
  { label: "Accessori", value: "accessori" },
  { label: "Elettronica", value: "elettronica" },
  { label: "Casa e Giardino", value: "casa" },
  { label: "Sport e Tempo Libero", value: "sport" },
  { label: "Bellezza e Cura", value: "bellezza" },
  { label: "Alimentari", value: "alimentari" },
];

export function getMovementTypeLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    received: "Ricevuto",
    sold: "Venduto",
    adjusted: "Rettificato",
    transferred: "Trasferito",
    returned: "Reso",
    damaged: "Danneggiato",
  };
  return labels[type] || type;
}

export function getMovementTypeTone(type: MovementType): "success" | "warning" | "critical" | "info" {
  const tones: Record<MovementType, "success" | "warning" | "critical" | "info"> = {
    received: "success",
    sold: "info",
    adjusted: "warning",
    transferred: "info",
    returned: "warning",
    damaged: "critical",
  };
  return tones[type] || "info";
}

export function getStockStatusLabel(status: InventoryItem["status"]): string {
  const labels: Record<InventoryItem["status"], string> = {
    in_stock: "Disponibile",
    low_stock: "Scorte basse",
    out_of_stock: "Esaurito",
  };
  return labels[status] || status;
}

export function getStockStatusTone(status: InventoryItem["status"]): "success" | "warning" | "critical" {
  const tones: Record<InventoryItem["status"], "success" | "warning" | "critical"> = {
    in_stock: "success",
    low_stock: "warning",
    out_of_stock: "critical",
  };
  return tones[status] || "warning";
}
