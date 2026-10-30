
import { apiRequest } from "./api";
import type { Product } from "../types/product";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function getProducts() {
  return apiRequest<ApiResponse<Product[]>>("/api/products");
}

export function getProductBySlug(slug: string) {
  return apiRequest<ApiResponse<Product>>(
    `/api/products/${slug}`
  );
}
