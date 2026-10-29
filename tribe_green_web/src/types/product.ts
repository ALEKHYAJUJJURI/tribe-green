
export interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  occasions: string[];
  customisation: string[];
  image: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}
