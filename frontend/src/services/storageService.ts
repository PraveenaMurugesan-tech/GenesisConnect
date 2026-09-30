// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — GenesisConnect
// Storage & Document Upload API Service
// ==============================================================================

import { apiClient } from "./api";

export interface UploadResponse {
  status: string;
  message?: string;
  storage_key: string;
  filename: string;
  bucket: string;
  url?: string;
  size_bytes?: number;
}

export interface SignedUrlResponse {
  status: string;
  requirement_id?: number;
  storage_key: string;
  document_name?: string;
  signed_url: string;
  expires_in_seconds: number;
}

/**
 * Admin: Upload product photo (JPEG, PNG, WebP <= 5MB)
 */
export const uploadProductImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>("/admin/storage/product-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Admin: Upload technical product datasheet (PDF <= 10MB)
 */
export const uploadProductDatasheet = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>("/admin/storage/product-datasheet", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Public: Customer uploads technical specification PDF for customized requirement (<= 10MB)
 * Files are saved to a strictly private vault and NO public URL is returned.
 */
export const uploadEnquiryDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>("/storage/enquiry-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Admin: Generate temporary signed download URL for private customer requirement document
 */
export const getEnquiryDocumentSignedUrl = async (
  requirementId: number,
  expiresInSeconds: number = 3600
): Promise<SignedUrlResponse> => {
  const response = await apiClient.get<SignedUrlResponse>(
    `/custom-requirements/${requirementId}/document-url`,
    {
      params: { expires_in: expiresInSeconds },
    }
  );
  return response.data;
};
