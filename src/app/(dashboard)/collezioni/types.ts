// Types for Collections Management System

export type CollectionType = "manual" | "automated";

export type ConditionField =
  | "product_title"
  | "product_type"
  | "product_vendor"
  | "product_tag"
  | "product_price"
  | "compare_at_price"
  | "inventory_stock"
  | "variant_title"
  | "variant_weight";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "is_set"
  | "is_not_set";

export type ConditionRelation = "all" | "any";

export interface CollectionCondition {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
}

export interface CollectionSEO {
  pageTitle: string;
  metaDescription: string;
  urlHandle: string;
}

export interface CollectionProduct {
  id: string;
  title: string;
  image: string;
  price: string;
  inventory: number;
  vendor: string;
  type: string;
  tags: string[];
  position: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  type: CollectionType;
  image: string;
  productsCount: number;
  products: CollectionProduct[];
  conditions: CollectionCondition[];
  conditionRelation: ConditionRelation;
  seo: CollectionSEO;
  sortOrder: CollectionSortOption;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CollectionSortOption =
  | "manual"
  | "best_selling"
  | "alpha_asc"
  | "alpha_desc"
  | "price_asc"
  | "price_desc"
  | "created_desc"
  | "created_asc";

export interface CollectionStats {
  totalCollections: number;
  totalProductsInCollections: number;
  automatedCollections: number;
  manualCollections: number;
}

export interface ConditionFieldOption {
  value: ConditionField;
  label: string;
}

export interface ConditionOperatorOption {
  value: ConditionOperator;
  label: string;
  applicableTo: ConditionField[];
}

export const CONDITION_FIELDS: ConditionFieldOption[] = [
  { value: "product_title", label: "Titolo prodotto" },
  { value: "product_type", label: "Tipo prodotto" },
  { value: "product_vendor", label: "Fornitore" },
  { value: "product_tag", label: "Tag prodotto" },
  { value: "product_price", label: "Prezzo prodotto" },
  { value: "compare_at_price", label: "Prezzo di confronto" },
  { value: "inventory_stock", label: "Quantita in magazzino" },
  { value: "variant_title", label: "Titolo variante" },
  { value: "variant_weight", label: "Peso variante" },
];

export const CONDITION_OPERATORS: ConditionOperatorOption[] = [
  { value: "equals", label: "E uguale a", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "not_equals", label: "Non e uguale a", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "contains", label: "Contiene", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "not_contains", label: "Non contiene", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "starts_with", label: "Inizia con", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "ends_with", label: "Finisce con", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "variant_title"] },
  { value: "greater_than", label: "Maggiore di", applicableTo: ["product_price", "compare_at_price", "inventory_stock", "variant_weight"] },
  { value: "less_than", label: "Minore di", applicableTo: ["product_price", "compare_at_price", "inventory_stock", "variant_weight"] },
  { value: "is_set", label: "E impostato", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "compare_at_price", "variant_title"] },
  { value: "is_not_set", label: "Non e impostato", applicableTo: ["product_title", "product_type", "product_vendor", "product_tag", "compare_at_price", "variant_title"] },
];

export const SORT_OPTIONS: { value: CollectionSortOption; label: string }[] = [
  { value: "manual", label: "Ordinamento manuale" },
  { value: "best_selling", label: "Piu venduti" },
  { value: "alpha_asc", label: "Alfabetico A-Z" },
  { value: "alpha_desc", label: "Alfabetico Z-A" },
  { value: "price_asc", label: "Prezzo crescente" },
  { value: "price_desc", label: "Prezzo decrescente" },
  { value: "created_desc", label: "Piu recenti" },
  { value: "created_asc", label: "Meno recenti" },
];
