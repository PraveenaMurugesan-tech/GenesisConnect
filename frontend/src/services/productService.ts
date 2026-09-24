// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Product Service Layer
// Phase 3: Decoupled service abstraction for products catalogue
// ==============================================================================

import { Product, ProductCategory, ProductFilterParams } from "../types";
import { PRODUCTS, CatalogueProduct } from "../data/products";

/**
 * Retrieve all active products with optional category and search filtering
 */
export const getProducts = (params?: ProductFilterParams): CatalogueProduct[] => {
  let results = PRODUCTS.filter((p) => p.isActive);

  if (!params) return results;

  const { category, search } = params;

  // Category filter
  if (category && category !== "All" && category !== "All Categories") {
    results = results.filter((p) => p.category === category);
  }

  // Text search (name, category, shortDescription, tagline)
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

  return results;
};

/**
 * Look up a product by its URL-safe unique slug
 */
export const getProductBySlug = (slug?: string): CatalogueProduct | undefined => {
  if (!slug || slug.trim() === "") return undefined;
  const normalized = slug.trim().toLowerCase();
  return PRODUCTS.find((p) => p.slug.toLowerCase() === normalized && p.isActive);
};

/**
 * Filter active products by category
 */
export const getProductsByCategory = (category: string): CatalogueProduct[] => {
  if (!category || category === "All" || category === "All Categories") {
    return getProducts();
  }
  return PRODUCTS.filter((p) => p.category === category && p.isActive);
};

/**
 * Search active products by keyword query across name, category, and description
 */
export const searchProducts = (query: string, category?: string): CatalogueProduct[] => {
  return getProducts({ search: query, category });
};

/**
 * Highlight key industrial & healthcare systems for homepage showcase
 */
export const getFeaturedProducts = (): CatalogueProduct[] => {
  const featuredSlugs = [
    "industrial-ups",
    "ct-scanner-ups",
    "igbt-static-voltage-stabilizers",
    "servo-stabilizers",
  ];
  return PRODUCTS.filter((p) => featuredSlugs.includes(p.slug) && p.isActive);
};

/**
 * Async API-Ready Service Layer
 * In Phase 4, the implementation inside these methods will call the FastAPI backend via Axios.
 * The consuming UI components remain unchanged.
 */
export const productService = {
  // Synchronous local data accessors
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,

  // Async API contract methods (Phase 4 mock/ready)
  async fetchProducts(params?: ProductFilterParams): Promise<Product[]> {
    // Phase 4: return (await apiClient.get<Product[]>("/products", { params })).data;
    return Promise.resolve(getProducts(params));
  },

  async fetchProductBySlug(slug: string): Promise<Product | null> {
    // Phase 4: return (await apiClient.get<Product>(`/products/${slug}`)).data;
    const item = getProductBySlug(slug);
    return Promise.resolve(item || null);
  },

  async fetchProductsByCategory(category: ProductCategory | string): Promise<Product[]> {
    // Phase 4: return (await apiClient.get<Product[]>(`/products?category=${encodeURIComponent(category)}`)).data;
    return Promise.resolve(getProductsByCategory(category));
  },

  async fetchSearchResults(query: string, category?: string): Promise<Product[]> {
    // Phase 4: return (await apiClient.get<Product[]>(`/products?search=${encodeURIComponent(query)}`)).data;
    return Promise.resolve(searchProducts(query, category));
  },
};

export default productService;
