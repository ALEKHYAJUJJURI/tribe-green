
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

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/products/${product.slug}`}
        className="block overflow-hidden bg-gray-100"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-800">
          {product.category}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
          {product.description}
        </p>

        <p className="mt-4 text-base font-bold text-gray-900">
          {formatPrice(product.minPrice)} – {formatPrice(product.maxPrice)}
          <span className="ml-1 text-xs font-normal text-gray-500">
            / unit
          </span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.customisation.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-800"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-green-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
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

  return (
    <main>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#f3f6ef]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-green-800">
              Thoughtful gifting. Lasting connections.
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Gifts that make
              <span className="block text-green-800">
                business personal.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              Discover thoughtfully curated corporate gifts for your team,
              clients and business partners. Make every occasion memorable.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex rounded-full bg-green-800 px-7 py-3.5 font-semibold text-white transition hover:bg-green-900"
            >
              Explore the collection
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </a>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span>✓ Thoughtful selections</span>
              <span>✓ Custom branding</span>
              <span>✓ Bulk gifting</span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=85"
              alt="Beautifully arranged corporate gift boxes"
              fetchPriority="high"
              className="h-72 w-full rounded-3xl object-cover shadow-xl sm:h-96 lg:h-[470px]"
            />

            <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-4 shadow-lg sm:left-8 sm:p-5">
              <p className="text-xs text-gray-500">
                Make it uniquely yours
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                Personalised corporate gifts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 lg:px-8">
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
          ].map((item) => (
            <div key={item.title} className="py-2 sm:px-4">
              <h2 className="font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product catalogue */}
      <section id="products" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-800">
                Our collection
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Gifts worth remembering.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Explore our collection of customisable gifts for teams,
                celebrations and business relationships.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {loading ? "Loading products..." : `${filteredProducts.length} products`}
            </p>
          </div>

          {/* Search */}
          <div className="mt-10">
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search products
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bottles, mugs, hampers..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Category filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  category === item
                    ? "border-green-800 bg-green-800 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Occasion and budget filters */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="occasion-filter"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Filter by occasion
              </label>

              <select
                id="occasion-filter"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
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
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Filter by budget
              </label>

              <select
                id="budget-filter"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
              >
                {budgets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading, error, and product states */}
          {loading ? (
            <div
              className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Loading products"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-semibold text-red-800">
                Couldn't load products
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <p className="mt-2 text-sm text-gray-600">
                Check that your backend is running and its URL is configured correctly.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-green-800 px-5 py-3 font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About section */}
      <section id="about" className="bg-[#f3f6ef]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-800">
              The Tribe Green approach
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              More than a gift. A lasting impression.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Whether you're welcoming new employees, celebrating milestones
              or thanking your clients, find gifts that make every connection
              more meaningful.
            </p>

            <a
              href="#products"
              className="mt-7 inline-flex rounded-full bg-green-800 px-7 py-3.5 font-semibold text-white hover:bg-green-900"
            >
              Find your perfect gift
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
