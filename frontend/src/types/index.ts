// ==============================================================================
// GenesisConnect Data Types & Contracts
// ==============================================================================

import { Product } from "./product";

export type UserRole = "SUPER_ADMIN" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductDocument {
  id: number;
  product_id: number;
  title: string;
  document_url: string;
  file_type?: string;
  file_size_bytes?: number;
  created_at: string;
}

export * from "./product";

export interface Service {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "QUOTED" | "CLOSED";

export interface QuoteRequest {
  id: number;
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  product_id?: number | string;
  message?: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export type RequirementStatus = "NEW" | "UNDER_REVIEW" | "ESTIMATED" | "QUOTED" | "CLOSED";

export interface CustomRequirement {
  id: number;
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  product?: string;
  capacity?: string;
  battery_specifications?: string;
  backup_requirements?: string;
  equipment_information?: string;
  additional_requirements?: string;
  document_url?: string;
  status: RequirementStatus;
  created_at: string;
  updated_at: string;
}

export type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactMessage {
  id: number;
  name: string;
  company_name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}
