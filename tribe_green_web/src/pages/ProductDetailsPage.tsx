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
      <main className="bg-[#FAF6EE]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid animate-pulse gap-10 md:grid-cols-2">
            <div className="h-96 rounded-3xl bg-[#EFE8D8]/70" />
            <div className="space-y-5">
              <div className="h-5 w-32 rounded bg-[#EFE8D8]/70" />
              <div className="h-10 w-3/4 rounded bg-[#EFE8D8]/70" />
              <div className="h-24 rounded bg-[#EFE8D8]/70" />
              <div className="h-12 rounded bg-[#EFE8D8]/70" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FAF6EE] px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-red-600 shadow-sm">
          !
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-stone-900">
          Product unavailable
        </h1>

        <p className="mt-3 max-w-md text-stone-600">
          {error || "We couldn't find this product."}
        </p>

        <Link
          to="/"
          className="mt-6 rounded-full bg-[#14532D] px-7 py-3 font-semibold text-white transition hover:bg-[#0F3D22]"
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
    <main className="bg-[#FAF6EE]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
          <Link to="/" className="font-medium hover:text-[#14532D]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-stone-900">{product.name}</span>
        </nav>

        <section className="grid gap-10 py-8 md:grid-cols-2 md:gap-14 md:py-12">
          {/* Product image */}
          <div className="self-start overflow-hidden rounded-[2rem] border border-[#EFE8D8] bg-white shadow-xl shadow-[#14532D]/10 md:sticky md:top-24">
            <img
              src={product.image}
              alt={product.name}
              fetchPriority="high"
              className="h-full max-h-[600px] min-h-[320px] w-full object-cover"
            />
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <span className="self-start rounded-full bg-[#F3E9D2] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 h-[3px] w-12 rounded-full bg-[#B8924A]" />

            <p className="mt-5 text-base leading-7 text-stone-600">
              {product.description}
            </p>

            <div className="mt-7 rounded-2xl border border-[#EFE8D8] bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-stone-500">
                Estimated price per unit
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#14532D]">
                {formatPrice(product.minPrice)} – {formatPrice(product.maxPrice)}
              </p>

              <p className="mt-3 border-t border-[#F3EEE0] pt-3 text-xs leading-5 text-stone-500">
                Final pricing may depend on order quantity and customisation.
                Confirm the quotation with our sales team.
              </p>
            </div>

            <div className="mt-7">
              <h2 className="font-bold text-stone-900">Suitable occasions</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.occasions.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#D9E8DC] bg-[#F1F7F2] px-3.5 py-2 text-sm font-medium text-[#14532D]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="font-bold text-stone-900">
                Customisation available
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.customisation.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-[#EFE8D8] bg-white px-3.5 py-2 text-sm font-medium text-stone-700"
                  >
                    <span className="mr-1.5 text-[#B8924A]">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enquiry"
                state={{ selectedProduct: product.slug }}
                className="flex flex-1 items-center justify-center rounded-full bg-[#14532D] px-6 py-4 text-center font-semibold text-white shadow-lg shadow-[#14532D]/20 transition hover:bg-[#0F3D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2"
              >
                Enquire About This Product
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full border border-[#14532D] bg-white px-6 py-4 font-semibold text-[#14532D] transition hover:bg-[#F1F7F2]"
              >
                WhatsApp Us
              </a>
            </div>

            <p className="mt-4 text-xs leading-5 text-stone-500">
              Looking for bulk gifting? Tell us your quantity, budget and
              delivery requirements to request a quotation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}