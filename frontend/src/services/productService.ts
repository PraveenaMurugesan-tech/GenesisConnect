// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Product Service Layer
// Phase 4: Production API-connected product service layer with Axios & FastAPI
// ==============================================================================

import { Product, ProductCategory, ProductFilterParams } from "../types";
import { PRODUCTS, CatalogueProduct } from "../data/products";
import apiClient from "./api";

export type { Product, ProductCategory, ProductFilterParams };

// Local in-memory cache populated from backend API
let _apiProductsCache: Product[] | null = null;

/**
 * Fetch all active products from FastAPI backend (/api/v1/products)
 * with optional category and search query parameters.
 */
export const fetchProducts = async (
  params?: ProductFilterParams
): Promise<Product[]> => {
  const queryParams: Record<string, string> = {};

  if (params?.category && params.category !== "All" && params.category !== "All Categories") {
    queryParams.category = params.category;
  }

  if (params?.search && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }

  const response = await apiClient.get<Product[]>("/products", {
    params: queryParams,
  });

  // Update in-memory cache when retrieving all products without filters
  if (!params || (!params.category && !params.search)) {
    _apiProductsCache = response.data;
  }

  return response.data;
};

/**
 * Fetch single product technical specifications by unique slug from FastAPI backend (/api/v1/products/{slug})
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  if (!slug || slug.trim() === "") return null;

  try {
    const response = await apiClient.get<Product>(`/products/${encodeURIComponent(slug.trim())}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Fetch active products filtered by equipment category
 */
export const fetchProductsByCategory = async (
  category: ProductCategory | string
): Promise<Product[]> => {
  return fetchProducts({ category });
};

/**
 * Search active products by keyword across name, description, and specs
 */
export const fetchSearchResults = async (
  query: string,
  category?: string
): Promise<Product[]> => {
  return fetchProducts({ search: query, category });
};

/**
 * Fetch featured products for homepage showcase
 */
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const featuredSlugs = [
    "industrial-ups",
    "ct-scanner-ups",
    "igbt-static-voltage-stabilizers",
    "servo-stabilizers",
  ];

  try {
    const products = await fetchProducts();
    const featured = products.filter((p) => featuredSlugs.includes(p.slug) && (p.isActive ?? p.is_active));
    return featured.length > 0 ? featured : products.slice(0, 4);
  } catch (error) {
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Synchronous Accessors (Preserved for form dropdowns & backwards compatibility)
// -----------------------------------------------------------------------------

export const getProducts = (params?: ProductFilterParams): CatalogueProduct[] => {
  const source = _apiProductsCache || PRODUCTS;
  let results = source.filter((p) => p.isActive ?? p.is_active);

  if (!params) return results as CatalogueProduct[];

  const { category, search } = params;

  if (category && category !== "All" && category !== "All Categories") {
    results = results.filter((p) => p.category === category);
  }

  if (search && search.trim() !== "") {
    const q = search.trim().toLowerCase();
    results = results.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchShortDesc = (p.shortDescription || p.short_description || "")
        .toLowerCase()
        .includes(q);
      const matchTagline = (p.tagline || "").toLowerCase().includes(q);
      const matchSlug = p.slug.toLowerCase().includes(q);

      return matchName || matchCategory || matchShortDesc || matchTagline || matchSlug;
    });
  }

  return results as CatalogueProduct[];
};

export const getProductBySlug = (slug?: string): CatalogueProduct | undefined => {
  if (!slug || slug.trim() === "") return undefined;
  const normalized = slug.trim().toLowerCase();
  const source = _apiProductsCache || PRODUCTS;
  return source.find((p) => p.slug.toLowerCase() === normalized && (p.isActive ?? p.is_active)) as CatalogueProduct | undefined;
};

export const getProductsByCategory = (category: string): CatalogueProduct[] => {
  if (!category || category === "All" || category === "All Categories") {
    return getProducts();
  }
  const source = _apiProductsCache || PRODUCTS;
  return source.filter((p) => p.category === category && (p.isActive ?? p.is_active)) as CatalogueProduct[];
};

export const searchProducts = (query: string, category?: string): CatalogueProduct[] => {
  return getProducts({ search: query, category });
};

export const getFeaturedProducts = (): CatalogueProduct[] => {
  const featuredSlugs = [
    "industrial-ups",
    "ct-scanner-ups",
    "igbt-static-voltage-stabilizers",
    "servo-stabilizers",
  ];
  const source = _apiProductsCache || PRODUCTS;
  return source.filter((p) => featuredSlugs.includes(p.slug) && (p.isActive ?? p.is_active)) as CatalogueProduct[];
};

export const productService = {
  fetchProducts,
  fetchProductBySlug,
  fetchProductsByCategory,
  fetchSearchResults,
  fetchFeaturedProducts,
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
};

export default productService;
