export interface EnquiryInput {
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
}

export interface SavedEnquiry extends EnquiryInput {
  id: string;
  submittedAt: string; // ISO timestamp
  productNames: string[];
}