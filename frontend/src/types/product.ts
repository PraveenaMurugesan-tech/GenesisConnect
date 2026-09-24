// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Product Domain Types & Contracts
// ==============================================================================

/**
 * Standard product categories for Genesis Power Equipments
 */
export type ProductCategory =
  | "UPS"
  | "Voltage Stabilizers"
  | "Power Conditioning"
  | "Medical Power Solutions"
  | "Other";

/**
 * Category list constant for UI filtering and validation
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "UPS",
  "Voltage Stabilizers",
  "Power Conditioning",
  "Medical Power Solutions",
  "Other",
];

/**
 * Technical specification key-value pair for equipment parameters
 */
export interface ProductSpecification {
  label: string;
  value: string;
}

/**
 * Product image reference with optional metadata
 */
export interface ProductImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

/**
 * Centralized Product Data Model
 * Prepared for Phase 4 API synchronization
 */
export interface Product {
  id: string | number;
  name: string;
  slug: string;
  category: ProductCategory | string;
  shortDescription?: string;
  description: string;
  features: string[];
  specifications: ProductSpecification[] | Record<string, any>;
  image?: string;
  images?: string[];
  datasheet?: string;
  isActive?: boolean;

  // Equipment domain metadata
  tagline?: string;
  applications?: string[];
  keyHighlights?: string[];

  // Compatibility aliases
  short_description?: string;
  key_highlights?: string[];
  image_url?: string;
  datasheet_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Query filter parameters for catalogue searching and filtering
 */
export interface ProductFilterParams {
  category?: ProductCategory | "All" | string;
  search?: string;
}

/**
 * Response contract shape for product queries
 */
export interface ProductQueryResponse {
  items: Product[];
  total: number;
}
