import { request } from "./api/client";
import type { Product } from "../types/product";

export const getProducts = () => request<Product[]>("/products");

export const getProductBySlug = (slug: string) =>
  request<Product>(`/products/${encodeURIComponent(slug)}`);