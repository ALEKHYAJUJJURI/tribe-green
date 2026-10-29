import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductLoadError from "./ProductLoadError";
import {
  getProducts,
  getProductBySlug,
  type Product,
} from "../../../lib/products";
import { connection } from "next/server";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}


export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch (error) {
    console.error("generateStaticParams failed:", error);
    return [];
  }
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const productName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${productName} | Tribe Green`,
    description: `Explore ${productName} from Tribe Green's corporate gifting collection. Enquire about bulk orders and customisation.`,
  };
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf9f4] p-8">
          <p className="text-[#244733]">
            Loading product details...
          </p>
        </main>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}

async function ProductDetailContent({ params }: Props) {
    await connection();
  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("Could not load product details:", error);
    return <ProductLoadError />;
  }

  if (!product) {
    notFound();
  }

  const message = `Hi Tribe Green! I'm interested in ${product.name} for corporate gifting. Please share bulk pricing and customisation details.`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      <header className="border-b border-[#e8e5db] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#244733]"
          >
            tribe green<span className="text-[#b1a56c]">.</span>
          </Link>

          <Link
            href="/#catalogue"
            className="text-sm font-medium text-[#244733] hover:underline"
          >
            ← Back to collection
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#777b70]">
          <Link href="/" className="hover:text-[#244733]">
            Home
          </Link>
          {" / "}
          <Link href="/#catalogue" className="hover:text-[#244733]">
            Collection
          </Link>
          {" / "}
          <span className="text-[#244733]">{product.name}</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-[#eeede4]">
            <img
              src={product.image}
              alt={product.name}
              className="h-[360px] w-full object-cover sm:h-[500px]"
            />
          </div>

          <div className="py-2 sm:py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#99834a]">
              {product.category}
            </p>

            <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight text-[#244733] sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-[#6b7468]">
              {product.description}
            </p>

            <div className="mt-7 border-y border-[#e0e1d6] py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#85897e]">
                Estimated price per unit
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#244733]">
                {formatPrice(product.minPrice)} –{" "}
                {formatPrice(product.maxPrice)}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#85897e]">
                Indicative pricing for this demonstration. Final pricing
                depends on quantity and customisation.
              </p>
            </div>

            <section className="mt-7">
              <h2 className="text-sm font-semibold text-[#244733]">
                Perfect for
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.occasions.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#dce1d5] bg-white px-3 py-2 text-xs text-[#53624f]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-7">
              <h2 className="text-sm font-semibold text-[#244733]">
                Make it yours
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.customisation.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#e8eddf] px-3 py-2 text-xs text-[#355e43]"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/enquiry?product=${product.slug}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#244733] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#355e43]"
              >
                Enquire about this gift <span>→</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[#cbd3c4] bg-white px-6 py-4 text-sm font-semibold text-[#244733] transition hover:bg-[#edf0e5]"
              >
                WhatsApp ↗
              </a>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-[#85897e]">
              Looking for bulk quantities? Tell us about your event and delivery
              requirements.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}