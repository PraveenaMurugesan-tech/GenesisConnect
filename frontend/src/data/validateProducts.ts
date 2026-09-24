// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Product Data Validation Layer
// Phase 3: Lightweight, development-time catalog integrity verification
// ==============================================================================

import { Product, ProductCategory, PRODUCT_CATEGORIES } from "../types";

export interface ValidationError {
  productId?: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// URL-safe lowercase slug pattern: e.g. "industrial-ups", "ct-scanner-ups"
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates a single product entity against required Genesis business constraints
 */
export const validateProduct = (
  product: Product,
  knownSlugs: Set<string> = new Set(),
  knownIds: Set<string> = new Set()
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const pId = String(product.id || "unknown");

  // 1. ID Validation
  if (!product.id || String(product.id).trim() === "") {
    errors.push({ productId: pId, field: "id", message: "Product ID is missing or empty." });
  } else if (knownIds.has(String(product.id))) {
    errors.push({ productId: pId, field: "id", message: `Duplicate Product ID detected: "${product.id}".` });
  }

  // 2. Name Validation
  if (!product.name || product.name.trim() === "") {
    errors.push({ productId: pId, field: "name", message: "Product name is required." });
  } else if (product.name.trim().length < 3) {
    errors.push({ productId: pId, field: "name", message: "Product name must be at least 3 characters." });
  }

  // 3. Slug Validation (unique, lowercase, URL-safe, stable)
  if (!product.slug || product.slug.trim() === "") {
    errors.push({ productId: pId, field: "slug", message: "Product slug is required." });
  } else {
    const slug = product.slug.trim();
    if (!SLUG_REGEX.test(slug)) {
      errors.push({
        productId: pId,
        field: "slug",
        message: `Slug "${slug}" is invalid. Must be lowercase, URL-safe, with alphanumeric characters and hyphens only.`,
      });
    }
    if (knownSlugs.has(slug)) {
      errors.push({
        productId: pId,
        field: "slug",
        message: `Duplicate product slug detected: "${slug}". Slugs must be globally unique.`,
      });
    }
  }

  // 4. Category Validation
  if (!product.category) {
    errors.push({ productId: pId, field: "category", message: "Category is required." });
  } else if (!PRODUCT_CATEGORIES.includes(product.category as ProductCategory)) {
    errors.push({
      productId: pId,
      field: "category",
      message: `Invalid category "${product.category}". Must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`,
    });
  }

  // 5. Short Description & Description
  const shortDesc = product.shortDescription || product.short_description;
  if (!shortDesc || shortDesc.trim() === "") {
    errors.push({ productId: pId, field: "shortDescription", message: "Short description is required." });
  }

  if (!product.description || product.description.trim() === "") {
    errors.push({ productId: pId, field: "description", message: "Full description is required." });
  }

  // 6. Features Validation
  if (!product.features || !Array.isArray(product.features) || product.features.length === 0) {
    errors.push({ productId: pId, field: "features", message: "Product must have at least one key feature." });
  }

  // 7. Specifications Validation
  if (!product.specifications || !Array.isArray(product.specifications)) {
    errors.push({ productId: pId, field: "specifications", message: "Specifications must be an array of label/value pairs." });
  } else {
    product.specifications.forEach((spec, idx) => {
      if (!spec.label || spec.label.trim() === "") {
        errors.push({ productId: pId, field: `specifications[${idx}].label`, message: "Specification label cannot be empty." });
      }
      if (!spec.value || spec.value.trim() === "") {
        errors.push({ productId: pId, field: `specifications[${idx}].value`, message: "Specification value cannot be empty." });
      }
    });
  }

  // 8. Active Status
  if (typeof product.isActive !== "boolean" && typeof product.is_active !== "boolean") {
    errors.push({ productId: pId, field: "isActive", message: "isActive flag must be a boolean." });
  }

  return errors;
};

/**
 * Validates the entire products catalogue and reports any inconsistencies
 */
export const validateProductCatalogue = (products: Product[]): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const knownSlugs = new Set<string>();
  const knownIds = new Set<string>();

  for (const product of products) {
    const errors = validateProduct(product, knownSlugs, knownIds);
    allErrors.push(...errors);

    if (product.slug) knownSlugs.add(product.slug.trim());
    if (product.id) knownIds.add(String(product.id).trim());
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Development-mode auto-validator to catch data issues early during local compilation
 */
export const runDevCatalogueValidation = (products: Product[]): boolean => {
  const result = validateProductCatalogue(products);
  if (!result.isValid) {
    console.error(`[GenesisConnect Catalogue Validation] Found ${result.errors.length} data errors:`);
    result.errors.forEach((err) => {
      console.error(`  - Product [${err.productId}] Field "${err.field}": ${err.message}`);
    });
    return false;
  }
  return true;
};
