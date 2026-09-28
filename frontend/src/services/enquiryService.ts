// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — GenesisConnect
// Customer Enquiry & Quotation API Client Service
// ==============================================================================

import { apiClient } from "./api";
import {
  QuoteRequest,
  QuoteStatus,
  CustomRequirement,
  RequirementStatus,
  ContactMessage,
  ContactStatus,
} from "../types";

export interface QuoteRequestPayload {
  customer_name: string;
  company_name?: string;
  email: string;
  phone: string;
  product_id?: number | null;
  product_name?: string;
  quantity?: string;
  requirement?: string;
  message?: string;
}

export interface CustomRequirementPayload {
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
}

export interface ContactMessagePayload {
  name: string;
  company_name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface EnquiryFilterParams {
  status?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

// ==============================================================================
// Public Enquiry Submission Methods
// ==============================================================================

export const submitQuoteRequest = async (payload: QuoteRequestPayload): Promise<QuoteRequest> => {
  const response = await apiClient.post<QuoteRequest>("/quote-requests", payload);
  return response.data;
};

export const submitCustomRequirement = async (payload: CustomRequirementPayload): Promise<CustomRequirement> => {
  const response = await apiClient.post<CustomRequirement>("/custom-requirements", payload);
  return response.data;
};

export const submitContactMessage = async (payload: ContactMessagePayload): Promise<ContactMessage> => {
  const response = await apiClient.post<ContactMessage>("/contact-messages", payload);
  return response.data;
};

// ==============================================================================
// Protected Administrator Enquiry Methods
// ==============================================================================

// --- Quote Requests ---
export const getAdminQuoteRequests = async (params?: EnquiryFilterParams): Promise<QuoteRequest[]> => {
  const response = await apiClient.get<QuoteRequest[]>("/admin/quote-requests", { params });
  return response.data;
};

export const getAdminQuoteRequest = async (id: number): Promise<QuoteRequest> => {
  const response = await apiClient.get<QuoteRequest>(`/admin/quote-requests/${id}`);
  return response.data;
};

export const updateQuoteRequestStatus = async (id: number, status: QuoteStatus): Promise<QuoteRequest> => {
  const response = await apiClient.patch<QuoteRequest>(`/admin/quote-requests/${id}/status`, { status });
  return response.data;
};

// --- Custom Requirements ---
export const getAdminCustomRequirements = async (params?: EnquiryFilterParams): Promise<CustomRequirement[]> => {
  const response = await apiClient.get<CustomRequirement[]>("/admin/custom-requirements", { params });
  return response.data;
};

export const getAdminCustomRequirement = async (id: number): Promise<CustomRequirement> => {
  const response = await apiClient.get<CustomRequirement>(`/admin/custom-requirements/${id}`);
  return response.data;
};

export const updateCustomRequirementStatus = async (
  id: number,
  status: RequirementStatus
): Promise<CustomRequirement> => {
  const response = await apiClient.patch<CustomRequirement>(`/admin/custom-requirements/${id}/status`, { status });
  return response.data;
};

// --- Contact Messages ---
export const getAdminContactMessages = async (params?: EnquiryFilterParams): Promise<ContactMessage[]> => {
  const response = await apiClient.get<ContactMessage[]>("/admin/contact-messages", { params });
  return response.data;
};

export const getAdminContactMessage = async (id: number): Promise<ContactMessage> => {
  const response = await apiClient.get<ContactMessage>(`/admin/contact-messages/${id}`);
  return response.data;
};

export const updateContactMessageStatus = async (id: number, status: ContactStatus): Promise<ContactMessage> => {
  const response = await apiClient.patch<ContactMessage>(`/admin/contact-messages/${id}/status`, { status });
  return response.data;
};
