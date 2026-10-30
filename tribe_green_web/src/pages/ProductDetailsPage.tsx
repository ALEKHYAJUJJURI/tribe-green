
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/productService";
import type { Product } from "../types/product";

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!slug) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await getProductBySlug(slug);
console.log("response of product details page",response.data)
        if (!response.success) {
          throw new Error("Unable to load this product.");
        }

        if (!cancelled) {
          setProduct(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this product. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid animate-pulse gap-10 md:grid-cols-2">
          <div className="h-96 rounded-3xl bg-gray-100" />
          <div className="space-y-5">
            <div className="h-5 w-32 rounded bg-gray-100" />
            <div className="h-10 w-3/4 rounded bg-gray-100" />
            <div className="h-24 rounded bg-gray-100" />
            <div className="h-12 rounded bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product unavailable
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "We couldn't find this product."}
        </p>

        <Link
          to="/"
          className="mt-6 rounded-full bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
        >
          Back to catalogue
        </Link>
      </main>
    );
  }

  const whatsappMessage = [
    `Hi Tribe Green, I'm interested in ${product.name}.`,
    `Product: ${product.name}`,
    `Price range: ${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)} per unit`,
    `Product link: ${window.location.href}`,
    "Please share more details about bulk orders and customisation.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link to="/" className="hover:text-green-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <section className="grid gap-10 py-8 md:grid-cols-2 md:gap-14 md:py-12">
          {/* Product image */}
          <div className="overflow-hidden rounded-3xl bg-[#f3f6ef]">
            <img
              src={product.image}
              alt={product.name}
              fetchPriority="high"
              className="h-full max-h-[600px] min-h-[320px] w-full object-cover"
            />
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-800">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-7 rounded-2xl bg-[#f3f6ef] p-5">
              <p className="text-sm text-gray-600">Estimated price per unit</p>

              <p className="mt-2 text-2xl font-bold text-gray-950">
                {formatPrice(product.minPrice)} – {formatPrice(product.maxPrice)}
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Final pricing may depend on order quantity and customisation.
                Confirm the quotation with our sales team.
              </p>
            </div>

            <div className="mt-7">
              <h2 className="font-semibold text-gray-900">
                Suitable occasions
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.occasions.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="font-semibold text-gray-900">
                Customisation available
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.customisation.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enquiry"
                state={{ selectedProduct: product.slug }}
                className="flex flex-1 items-center justify-center rounded-full bg-green-800 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-green-900"
              >
                Enquire About This Product
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full border border-green-800 px-6 py-3.5 font-semibold text-green-800 transition hover:bg-green-50"
              >
                WhatsApp Us
              </a>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Looking for bulk gifting? Tell us your quantity, budget and
              delivery requirements to request a quotation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
