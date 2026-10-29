
import { apiRequest } from "./api";

export interface EnquiryPayload {
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: number;
  budget: string;
  deliveryDate: string;
  selectedProducts: string[];
  customisation: string[];
  message: string;
  source: "website";
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export function createEnquiry(payload: EnquiryPayload) {
  return apiRequest<EnquiryResponse>("/api/enquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
