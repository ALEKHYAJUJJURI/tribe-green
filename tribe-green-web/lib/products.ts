
export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  occasions: string[];
  customisation: string[];
  image: string;
};

const API_BASE =
  process.env.BACKEND_API_URL ;

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load products from the backend.");
  }

  const result = await response.json();

  // Supports both { data: [...] } and a direct array response.
  const products = Array.isArray(result) ? result : result.data;

  if (!Array.isArray(products)) {
    throw new Error("The products API returned an unexpected response.");
  }

  return products as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const response = await fetch(
    `${API_BASE}/api/products/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product details.");
  }

  const result = await response.json();

  return (result.data ?? result) as Product;
}
