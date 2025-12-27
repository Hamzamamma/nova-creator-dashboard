// TypeScript interfaces for Products management system

export interface ProductVariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  quantity: number;
  options: ProductVariantOption[];
  imageUrl: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  urlHandle: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  category: string;
  tags: string[];
  status: "active" | "draft" | "archived";
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: number;
  variants: ProductVariant[];
  images: ProductImage[];
  featuredImage: string | null;
  seo: ProductSEO;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  category: string;
  tags: string[];
  status: "active" | "draft" | "archived";
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    urlHandle: string;
  };
  variants: ProductVariantFormData[];
  images: ProductImage[];
}

export interface ProductVariantFormData {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  quantity: string;
  options: ProductVariantOption[];
}

export interface ProductFiltersState {
  status: string;
  category: string;
  priceMin: string;
  priceMax: string;
  stockStatus: string;
  vendor: string;
  sortBy: string;
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  outOfStock: number;
  lowStock: number;
}

export type ProductCategory =
  | "abbigliamento"
  | "accessori"
  | "elettronica"
  | "casa"
  | "sport"
  | "bellezza"
  | "alimentari"
  | "altro";

export const PRODUCT_CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: "Abbigliamento", value: "abbigliamento" },
  { label: "Accessori", value: "accessori" },
  { label: "Elettronica", value: "elettronica" },
  { label: "Casa e Giardino", value: "casa" },
  { label: "Sport e Tempo Libero", value: "sport" },
  { label: "Bellezza e Cura", value: "bellezza" },
  { label: "Alimentari", value: "alimentari" },
  { label: "Altro", value: "altro" },
];

export const PRODUCT_STATUSES: { label: string; value: Product["status"]; tone: "success" | "warning" | "info" }[] = [
  { label: "Attivo", value: "active", tone: "success" },
  { label: "Bozza", value: "draft", tone: "warning" },
  { label: "Archiviato", value: "archived", tone: "info" },
];

export const STOCK_OPTIONS = [
  { label: "Tutti", value: "" },
  { label: "Disponibile", value: "in_stock" },
  { label: "Esaurito", value: "out_of_stock" },
  { label: "Scorte basse", value: "low_stock" },
];

export const SORT_OPTIONS = [
  { label: "Data creazione (recenti)", value: "created_desc" },
  { label: "Data creazione (meno recenti)", value: "created_asc" },
  { label: "Titolo (A-Z)", value: "title_asc" },
  { label: "Titolo (Z-A)", value: "title_desc" },
  { label: "Prezzo (basso-alto)", value: "price_asc" },
  { label: "Prezzo (alto-basso)", value: "price_desc" },
  { label: "Quantita (basso-alto)", value: "quantity_asc" },
  { label: "Quantita (alto-basso)", value: "quantity_desc" },
];
