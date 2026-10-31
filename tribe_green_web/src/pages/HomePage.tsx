import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

const categories = [
  "All",
  "Drinkware",
  "Apparel",
  "Work Essentials",
  "Wellness",
];

const occasions = [
  "All occasions",
  "Employee Onboarding",
  "Corporate Diwali Gifting",
  "New Year Gifts",
  "Client and Vendor Gifting",
  "Events and Trade Shows",
  "Employee Recognition",
];

const budgets = [
  "All budgets",
  "Under ₹500",
  "₹500 to ₹1,500",
  "₹1,500 to ₹3,000",
  "Above ₹3,000",
];

function matchesBudget(product: Product, budget: string) {
  switch (budget) {
    case "Under ₹500":
      return product.minPrice < 500;

    case "₹500 to ₹1,500":
      return product.minPrice <= 1500 && product.maxPrice >= 500;

    case "₹1,500 to ₹3,000":
      return product.minPrice <= 3000 && product.maxPrice >= 1500;

    case "Above ₹3,000":
      return product.maxPrice > 3000;

    default:
      return true;
  }
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

const selectClass =
  "w-full rounded-xl border border-[#E7DFCB] bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/15";

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EFE8D8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#14532D]/10">
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-stone-100"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#FAF6EE]/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8A6A2B]">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-stone-900">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-stone-600">
          {product.description}
        </p>

        <p className="mt-4 text-lg font-extrabold text-[#14532D]">
          {formatPrice(product.minPrice)} – {formatPrice(product.maxPrice)}
          <span className="ml-1 text-xs font-normal text-stone-500">
            / unit
          </span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.customisation.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#F1F7F2] px-3 py-1 text-xs font-medium text-[#14532D]"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="mt-auto flex w-full items-center justify-center rounded-xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0F3D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [occasion, setOccasion] = useState("All occasions");
  const [budget, setBudget] = useState("All budgets");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        console.log("response of products in the homepage",response.data)

        if (!response.success) {
          throw new Error("Unable to load products.");
        }

        setProducts(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesOccasion =
        occasion === "All occasions" ||
        product.occasions.includes(occasion);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesOccasion &&
        matchesBudget(product, budget)
      );
    });
  }, [products, search, category, occasion, budget]);

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setOccasion("All occasions");
    setBudget("All budgets");
  }

  const hasActiveFilters = Boolean(
    search.trim() ||
      category !== "All" ||
      occasion !== "All occasions" ||
      budget !== "All budgets",
  );

  return (
    <main className="bg-[#FAF6EE]">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#FAF6EE]">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#14532D]/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#B8924A]/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-[#E7DFCB] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
              Thoughtful gifting. Lasting connections.
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              Gifts that make
              <span className="block text-[#14532D]">business personal.</span>
            </h1>

            <div className="mt-6 h-[3px] w-14 rounded-full bg-[#B8924A]" />

            <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
              Discover thoughtfully curated corporate gifts for your team,
              clients and business partners. Make every occasion memorable.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex items-center rounded-full bg-[#14532D] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#14532D]/20 transition hover:bg-[#0F3D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2"
            >
              Explore the collection
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </a>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-600">
              <span>
                <span className="mr-1.5 text-[#B8924A]">✓</span>
                Thoughtful selections
              </span>
              <span>
                <span className="mr-1.5 text-[#B8924A]">✓</span>
                Custom branding
              </span>
              <span>
                <span className="mr-1.5 text-[#B8924A]">✓</span>
                Bulk gifting
              </span>
            </div>
          </div>

          <div className="relative pb-6">
            <img
              src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=85"
              alt="Beautifully arranged corporate gift boxes"
              fetchPriority="high"
              className="h-72 w-full rounded-[2rem] object-cover shadow-2xl shadow-[#14532D]/15 sm:h-96 lg:h-[480px]"
            />

            <div className="absolute -bottom-0 left-4 rounded-2xl border border-[#EFE8D8] bg-white p-4 shadow-lg sm:left-8 sm:p-5">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
                Make it uniquely yours
              </p>
              <p className="mt-1 font-bold text-stone-900">
                Personalised corporate gifts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-[#EFE8D8] bg-white">
        <div className="mx-auto grid max-w-7xl gap-2 px-5 py-8 sm:grid-cols-3 sm:gap-6 lg:px-8">
          {[
            {
              title: "Made for your brand",
              description: "Customisation for your corporate identity.",
            },
            {
              title: "For every occasion",
              description: "From welcome kits to festive hampers.",
            },
            {
              title: "Bulk gifting made easy",
              description: "Tell us your requirements and get in touch.",
            },
          ].map((item, index) => (
            <div key={item.title} className="flex gap-4 py-3 sm:px-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E9D2] text-sm font-extrabold text-[#8A6A2B]">
                {index + 1}
              </span>
              <div>
                <h2 className="font-bold text-stone-900">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product catalogue */}
      <section id="products" className="scroll-mt-24 bg-[#FAF6EE]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
                Our collection
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
                Gifts worth remembering.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Explore our collection of customisable gifts for teams,
                celebrations and business relationships.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-stone-500">
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} products`}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-[#14532D] underline-offset-4 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters panel */}
          <div className="mt-10 rounded-3xl border border-[#EFE8D8] bg-white p-5 shadow-sm sm:p-6">
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-semibold text-stone-700"
            >
              Search products
            </label>

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bottles, mugs, hampers..."
                className="w-full rounded-xl border border-[#E7DFCB] bg-[#FDFBF7] py-3 pl-12 pr-4 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/15"
              />
            </div>

            {/* Category filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                    category === item
                      ? "border-[#14532D] bg-[#14532D] text-white"
                      : "border-[#E7DFCB] bg-white text-stone-700 hover:border-[#14532D]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Occasion and budget filters */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="occasion-filter"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Filter by occasion
                </label>

                <select
                  id="occasion-filter"
                  value={occasion}
                  onChange={(event) => setOccasion(event.target.value)}
                  className={selectClass}
                >
                  {occasions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="budget-filter"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Filter by budget
                </label>

                <select
                  id="budget-filter"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className={selectClass}
                >
                  {budgets.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading, error, and product states */}
          {loading ? (
            <div
              className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Loading products"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-2xl bg-[#EFE8D8]/60"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-bold text-red-800">
                Couldn't load products
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <p className="mt-2 text-sm text-stone-600">
                Check that your backend is running and its URL is configured correctly.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#14532D] px-6 py-3 font-semibold text-white transition hover:bg-[#0F3D22]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-xl font-bold text-stone-900">
                No products found
              </h3>
              <p className="mt-3 text-sm text-stone-600">
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-[#14532D] px-6 py-3 font-semibold text-white transition hover:bg-[#0F3D22]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About section */}
      <section id="about" className="bg-[#14532D]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#E3C98F]">
              The Tribe Green approach
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              More than a gift. A lasting impression.
            </h2>

            <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-[#B8924A]" />

            <p className="mt-6 leading-7 text-green-100">
              Whether you're welcoming new employees, celebrating milestones
              or thanking your clients, find gifts that make every connection
              more meaningful.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex rounded-full bg-[#FAF6EE] px-7 py-3.5 font-semibold text-[#14532D] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]"
            >
              Find your perfect gift
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}