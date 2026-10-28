

"use client";

import { useEffect, useState, useMemo } from "react";
import { getProducts, type Product as ApiProduct } from "../lib/products";

// The backend Product type is the source of truth.
// "tag" is optional because it may not be included in the API response.
type Product = ApiProduct & {
  tag?: string;
};



const categories = [
  "All Gifts",
  "Drinkware",
  "Apparel",
  "Work Essentials",
  "Wellness",
];

const occasions = [
  "All Occasions",
  "Employee Onboarding",
  "Corporate Diwali Gifting",
  "New Year Gifts",
  "Client and Vendor Gifting",
  "Events and Trade Shows",
  "Employee Recognition",
];

const budgets = [
  { label: "All Budgets", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500–₹1,500", min: 500, max: 1500 },
  { label: "₹1,500–₹3,000", min: 1500, max: 3000 },
  { label: "Above ₹3,000", min: 3000, max: Infinity },
];

function money(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function Home() {
  const [category, setCategory] = useState("All Gifts");
  const [occasion, setOccasion] = useState("All Occasions");
  const [budget, setBudget] = useState("All Budgets");
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [apiError, setApiError] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadProducts() {
    try {
      const data = await getProducts();

      if (!cancelled) {
        setProducts(data);
        setApiError("");
      }
    } catch (error) {
      if (!cancelled) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to load products."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void loadProducts();

  return () => {
    cancelled = true;
  };
}, []);


  const filteredProducts = useMemo(() => {
    const selectedBudget =
      budgets.find((item) => item.label === budget) ?? budgets[0];

    return products.filter((product) => {
      const matchesCategory =
        category === "All Gifts" || product.category === category;

      const matchesOccasion =
        occasion === "All Occasions" ||
        product.occasions.includes(occasion);

      const matchesBudget =
        budget === "All Budgets" ||
        (product.maxPrice >= selectedBudget.min &&
          product.minPrice <= selectedBudget.max);

      const matchesSearch =
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesCategory &&
        matchesOccasion &&
        matchesBudget &&
        matchesSearch
      );
    });
  }, [products, category, occasion, budget, search]);

  function resetFilters() {
    setCategory("All Gifts");
    setOccasion("All Occasions");
    setBudget("All Budgets");
    setSearch("");
  }

  return (
    <main className="min-h-screen">
      {/* Announcement bar */}
      <div className="bg-[#244733] px-4 py-2 text-center text-xs tracking-wide text-white sm:text-sm">
        Thoughtful gifting for teams that make a difference.
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-[#e8e5db] bg-[#faf9f4]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <a href="#" className="shrink-0">
            <span className="block text-2xl font-bold tracking-tight text-[#244733]">
              tribe green<span className="text-[#b1a56c]">.</span>
            </span>
            <span className="hidden text-[9px] tracking-[0.22em] text-[#777b6d] sm:block">
              THOUGHTFUL GIFTS. LASTING IMPACT.
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-[#465348] md:flex">
            <a href="#catalogue" className="transition hover:text-[#9a7d3e]">
              Our Collection
            </a>
            <a href="#occasions" className="transition hover:text-[#9a7d3e]">
              Shop by Occasion
            </a>
            <a href="#about" className="transition hover:text-[#9a7d3e]">
              Our Approach
            </a>
          </div>

          <a
            href="#enquire"
            className="shrink-0 rounded-full bg-[#244733] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#355e43] sm:px-5 sm:text-sm"
          >
            Let&apos;s Talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f0efe4]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
          <div className="relative z-10">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7843] sm:text-sm">
              Corporate gifting, thoughtfully done
            </p>

            <h1 className="max-w-xl text-4xl leading-[1.13] font-medium tracking-tight text-[#244733] sm:text-5xl lg:text-6xl">
              Make every
              <br />
              <span className="font-serif italic">connection</span> count.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#626c60] sm:text-base">
              Thoughtful gifts for the people who move your business forward.
              Discover meaningful welcome kits, festive hampers and everyday
              essentials made personal.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogue"
                className="rounded-full bg-[#244733] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#355e43]"
              >
                Explore the collection <span aria-hidden="true">→</span>
              </a>
              <a
                href="#enquire"
                className="rounded-full border border-[#b7bdaf] px-6 py-3.5 text-sm font-medium text-[#244733] transition hover:bg-white/60"
              >
                Plan a bulk order
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#d8d9ca] pt-6 text-xs text-[#657063] sm:text-sm">
              <span>✳ Curated with care</span>
              <span>✳ Made for your brand</span>
              <span>✳ Bulk gifting made easy</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[45%] bg-[#dfe3d1] blur-2xl" />
            <div className="relative grid grid-cols-2 items-center gap-3 sm:gap-4">
              <div className="mt-9 overflow-hidden rounded-t-full rounded-b-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85"
                  alt="Notebook and stationery for a corporate welcome kit"
                  className="h-60 w-full object-cover sm:h-80"
                />
              </div>
              <div className="mb-9 overflow-hidden rounded-2xl rounded-b-[100px]">
                <img
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85"
                  alt="Reusable bottle for corporate gifting"
                  className="h-60 w-full object-cover sm:h-80"
                />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/70 bg-[#faf9f4]/95 px-5 py-3 text-center shadow-sm">
                <p className="whitespace-nowrap text-xs font-semibold text-[#244733] sm:text-sm">
                  Gifts with a little more meaning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="occasions" className="border-b border-[#e8e5db] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-6 sm:grid-cols-4 sm:px-8 lg:px-12">
          {[
            { title: "Drinkware", detail: "Everyday essentials", symbol: "◯" },
            { title: "Apparel", detail: "Wear your brand", symbol: "✳" },
            {
              title: "Work Essentials",
              detail: "Made for the workday",
              symbol: "▤",
            },
            {
              title: "Wellness",
              detail: "A thoughtful pause",
              symbol: "❋",
            },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => {
                setCategory(item.title);
                document
                  .getElementById("catalogue")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 rounded-xl p-3 text-left transition hover:bg-[#f0efe4]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf0e5] text-xl text-[#244733] transition group-hover:bg-[#dfe6d6]">
                {item.symbol}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#244733]">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-[#7a8175]">
                  {item.detail}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Product catalogue */}
      <section id="catalogue" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#99834a]">
                The gifting edit
              </p>
              <h2 className="text-3xl font-medium tracking-tight text-[#244733] sm:text-4xl">
                Good things, thoughtfully chosen.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#72776d] sm:text-base">
                Discover gifts that feel personal, reflect your brand and make
                people feel appreciated.
              </p>
            </div>
            <span className="text-sm text-[#73796d]">
              {filteredProducts.length} products
            </span>
          </div>

          {/* Search */}
          <div className="mb-5">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#e3e2d8] bg-white px-4 py-3">
              <span aria-hidden="true" className="text-lg text-[#6c7969]">
                ⌕
              </span>
              <input
                id="product-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gifts, products or categories..."
                className="w-full bg-transparent text-sm text-[#244733] outline-none placeholder:text-[#9a9e93]"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium transition sm:text-sm ${
                  category === item
                    ? "border-[#244733] bg-[#244733] text-white"
                    : "border-[#e1e1d7] bg-white text-[#596355] hover:border-[#244733]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Occasion and budget filters */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="occasion-filter"
                className="mb-2 block text-xs font-semibold text-[#626c60]"
              >
                SHOP BY OCCASION
              </label>
              <select
                id="occasion-filter"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                className="w-full rounded-xl border border-[#e1e1d7] bg-white px-4 py-3 text-sm text-[#465348] outline-none focus:border-[#244733]"
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
                className="mb-2 block text-xs font-semibold text-[#626c60]"
              >
                YOUR BUDGET PER UNIT
              </label>
              <select
                id="budget-filter"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full rounded-xl border border-[#e1e1d7] bg-white px-4 py-3 text-sm text-[#465348] outline-none focus:border-[#244733]"
              >
                {budgets.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product cards */}
          {loading ? (
            <p className="rounded-2xl bg-white px-5 py-16 text-center text-sm text-[#626c60]">
              Loading products...
            </p>
          ) : apiError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center"
            >
              <p className="text-lg font-medium text-red-800">
                We couldn&apos;t load the product catalogue.
              </p>
              <p className="mt-2 text-sm text-red-700">{apiError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#244733] px-5 py-3 text-sm font-medium text-white hover:bg-[#355e43]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article key={product.slug} className="group min-w-0">
                  <a
                    href={`/products/${product.slug}`}
                    className="relative mb-4 block overflow-hidden rounded-2xl bg-[#eeede4]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#faf9f4] px-3 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#244733]">
                        {product.tag}
                      </span>
                    )}
                    <span className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-[#244733] shadow-sm transition group-hover:bg-[#244733] group-hover:text-white">
                      ↗
                    </span>
                  </a>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92917d]">
                        {product.category}
                      </p>
                      <h3 className="text-base font-semibold text-[#244733]">
                        <a
                          href={`/products/${product.slug}`}
                          className="hover:underline"
                        >
                          {product.name}
                        </a>
                      </h3>
                    </div>
                    <span className="shrink-0 text-xs text-[#8b7843]">
                      Per unit
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#777b70]">
                    {product.description}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#244733]">
                    {money(product.minPrice)} – {money(product.maxPrice)}
                  </p>

                  <a
                    href={`/products/${product.slug}`}
                    className="mt-4 inline-flex items-center gap-2 border-b border-[#b6c0b0] pb-1 text-xs font-semibold text-[#355e43] transition hover:border-[#244733]"
                  >
                    View product details <span>→</span>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8d9ca] bg-white px-5 py-16 text-center">
              <p className="text-lg font-medium text-[#244733]">
                No gifts found
              </p>
              <p className="mt-2 text-sm text-[#777b70]">
                Try a different search or change your filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-full bg-[#244733] px-5 py-3 text-sm font-medium text-white hover:bg-[#355e43]"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={resetFilters}
              className="rounded-full border border-[#cbd0c3] px-6 py-3 text-sm font-medium text-[#355e43] transition hover:bg-white"
            >
              View all gifts
            </button>
          </div>
        </div>
      </section>

      {/* Enquiry call to action */}
      <section id="enquire" className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#244733] px-6 py-12 sm:px-12 sm:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d6c898]">
                Have something in mind?
              </p>
              <h2 className="max-w-xl text-3xl leading-tight font-medium text-white sm:text-4xl">
                Let&apos;s make your next gift memorable.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#e0e7dc]">
                Tell us about your team, your occasion and your budget. We&apos;ll
                help you find something thoughtful.
              </p>
            </div>
            <div className="md:justify-self-end">
              <a
                href="/enquiry"
                className="inline-flex items-center gap-3 rounded-full bg-[#f4f0df] px-6 py-4 text-sm font-semibold text-[#244733] transition hover:bg-white"
              >
                Start your enquiry <span>↗</span>
              </a>
              <p className="mt-4 text-xs text-[#d5dfd2]">
                For teams, clients, events and everything in between.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-[#e8e5db] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
          <div>
            <p className="text-xl font-bold text-[#244733]">tribe green.</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#777b70]">
              Corporate gifting, with thought behind every detail.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#244733]">
              Explore
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#777b70]">
              <a href="#catalogue" className="hover:text-[#244733]">
                All gifts
              </a>
              <a href="#occasions" className="hover:text-[#244733]">
                Categories
              </a>
              <a href="#enquire" className="hover:text-[#244733]">
                Bulk enquiries
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#244733]">
              Made for meaningful connections
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#777b70]">
              Welcome kits, team celebrations, festive gifting and thoughtful
              gestures for your clients and partners.
            </p>
          </div>
        </div>
        <div className="border-t border-[#e8e5db] px-5 py-5 text-center text-xs text-[#85897e]">
         © 2026 Tribe Green. Assignment demonstration website.
        </div>
      </section>
    </main>
  );
}


