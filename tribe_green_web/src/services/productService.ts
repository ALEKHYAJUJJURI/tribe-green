import { apiRequest } from "./api";
import type {
  ProductResponse,
  ProductsResponse,
} from "../types/product";

export function getProducts() {
  return apiRequest<ProductsResponse>("/api/products");
}

export function getProductBySlug(slug: string) {
  return apiRequest<ProductResponse>(
    `/api/products/${encodeURIComponent(slug)}`,
  );
}