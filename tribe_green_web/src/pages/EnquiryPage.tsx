
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { createEnquiry } from "../services/enquiryService";
import type { Product } from "../types/product";

const occasions = [
  "Employee Onboarding",
  "Corporate Diwali Gifting",
  "New Year Gifts",
  "Client and Vendor Gifting",
  "Events and Trade Shows",
  "Employee Recognition",
];

const budgets = [
  "Under ₹500",
  "₹500–₹1,500",
  "₹1,500–₹3,000",
  "Above ₹3,000",
];

const customisationOptions = [
  "Logo printing",
  "Laser engraving",
  "Name personalisation",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";

const labelClass = "block text-sm font-semibold text-gray-700";

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EnquiryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialProduct = (
    location.state as { selectedProduct?: string } | null
  )?.selectedProduct;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialProduct ? [initialProduct] : []
  );
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [units, setUnits] = useState("100");
  const [budget, setBudget] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [customisation, setCustomisation] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await getProducts();

        if (!cancelled) {
          setProducts(response.data);

          if (initialProduct) {
            const exists = response.data.some(
              (product) => product.slug === initialProduct
            );

            if (!exists) {
              setSelectedProducts([]);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setProductError(
            err instanceof Error
              ? err.message
              : "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [initialProduct]);

  function toggleProduct(slug: string) {
    setSelectedProducts((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  }

  function toggleCustomisation(option: string) {
    setCustomisation((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (!Number.isInteger(Number(units)) || Number(units) < 1) {
      setError("Quantity must be a whole number greater than zero.");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    if (!deliveryDate || deliveryDate < getTodayDate()) {
      setError("Choose a valid delivery date that is today or later.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await createEnquiry({
        name: name.trim(),
        company: company.trim(),
        phone,
        email: email.trim(),
        occasion,
        units: Number(units),
        budget,
        deliveryDate,
        selectedProducts,
        customisation,
        message: message.trim(),
        source: "website",
      });

      if (response.success) {
        navigate("/thank-you", {
          state: { enquiryId: response.data.id },
        });
      } else {
        setError(response.message || "Unable to submit your enquiry.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="text-sm font-semibold text-green-800 hover:underline"
        >
          ← Back to catalogue
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-green-800">
            Corporate gifting
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Tell us what you need
          </h1>

          <p className="mt-3 text-gray-600">
            Share your requirements and our team can help you plan your
            corporate gifts.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {productError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              {productError} You can retry by refreshing the page.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900">
                1. Contact details
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Full name *
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Company name *
                  <input
                    className={inputClass}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    autoComplete="organization"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Phone number *
                  <input
                    className={inputClass}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit phone number"
                    autoComplete="tel-national"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter exactly 10 digits"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Email address *
                  <input
                    className={inputClass}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                2. Gifting requirements
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Occasion *
                  <select
                    className={inputClass}
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    required
                  >
                    <option value="">Select an occasion</option>
                    {occasions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Estimated quantity *
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    step={1}
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Budget per unit *
                  <select
                    className={inputClass}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  >
                    <option value="">Select your budget</option>
                    {budgets.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Required delivery date *
                  <input
                    className={inputClass}
                    type="date"
                    min={getTodayDate()}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              <fieldset className="mt-6">
                <legend className={labelClass}>
                  Select products * (choose one or more)
                </legend>

                {loadingProducts ? (
                  <p className="mt-3 text-sm text-gray-500">
                    Loading products...
                  </p>
                ) : products.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">
                    No products are available right now.
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {products.map((product) => {
                      const checked = selectedProducts.includes(product.slug);

                      return (
                        <label
                          key={product.slug}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                            checked
                              ? "border-green-700 bg-green-50"
                              : "border-gray-200 hover:border-green-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 accent-green-800"
                            checked={checked}
                            onChange={() => toggleProduct(product.slug)}
                          />

                          <span>
                            <span className="block font-semibold text-gray-900">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-sm text-gray-600">
                              {product.category} · ₹
                              {product.minPrice.toLocaleString("en-IN")} – ₹
                              {product.maxPrice.toLocaleString("en-IN")}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                3. Customisation
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Select any options you would like.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {customisationOptions.map((option) => {
                  const checked = customisation.includes(option);

                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium ${
                        checked
                          ? "border-green-700 bg-green-50 text-green-900"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-green-800"
                        checked={checked}
                        onChange={() => toggleCustomisation(option)}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>

              <label className={`${labelClass} mt-6`}>
                Additional requirements
                <textarea
                  className={inputClass}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about packaging, branding, delivery locations, or anything else..."
                  rows={4}
                />
              </label>
            </section>

            <button
              type="submit"
              disabled={submitting || loadingProducts || products.length === 0}
              className="w-full rounded-full bg-green-800 px-6 py-4 font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting enquiry..." : "Submit enquiry"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Fields marked * are required.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
