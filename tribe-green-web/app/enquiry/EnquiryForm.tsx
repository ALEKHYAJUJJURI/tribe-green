
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const products = [
  { value: "steel-water-bottle", label: "Steel Water Bottle" },
  { value: "ceramic-coffee-mug", label: "Ceramic Coffee Mug" },
  { value: "premium-polo-tshirt", label: "Premium Polo T-Shirt" },
  { value: "branded-hoodie", label: "Everyday Team Hoodie" },
  { value: "executive-notebook", label: "Executive Notebook Set" },
  { value: "laptop-sleeve", label: "Minimal Laptop Sleeve" },
  { value: "wellness-gift-box", label: "Everyday Wellness Box" },
  { value: "premium-festive-hamper", label: "Signature Festive Hamper" },
];

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
  "Name personalisation",
  "Laser engraving",
  "Custom packaging",
];

type FormValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: string;
  budget: string;
  deliveryDate: string;
  selectedProducts: string[];
  customisation: string[];
  message: string;
};

type TextField =
  | "name"
  | "company"
  | "phone"
  | "email"
  | "occasion"
  | "units"
  | "budget"
  | "deliveryDate"
  | "message";

export default function EnquiryForm() {

    
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product");

  const [form, setForm] = useState<FormValues>({
    name: "",
    company: "",
    phone: "",
    email: "",
    occasion: "",
    units: "",
    budget: "",
    deliveryDate: "",
    selectedProducts: [],
    customisation: [],
    message: "",
  });

 const [error, setError] = useState("");
const [submitted, setSubmitted] = useState(false);
const [submissionReference, setSubmissionReference] = useState("");

  useEffect(() => {
    if (
      productFromUrl &&
      products.some((product) => product.value === productFromUrl)
    ) {
      setForm((previous) => ({
        ...previous,
        selectedProducts: previous.selectedProducts.includes(productFromUrl)
          ? previous.selectedProducts
          : [...previous.selectedProducts, productFromUrl],
      }));
    }
  }, [productFromUrl]);

  function updateField(field: TextField, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function toggleOption(
    field: "selectedProducts" | "customisation",
    value: string
  ) {
    setForm((previous) => {
      const currentValues = previous[field];

      return {
        ...previous,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  }

 async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();
  setError("");

  if (!/^[0-9]{10}$/.test(form.phone)) {
    setError("Enter a valid 10-digit phone number.");
    return;
  }

  if (!Number.isInteger(Number(form.units)) || Number(form.units) < 1) {
    setError("Quantity must be at least 1 unit.");
    return;
  }

  if (form.selectedProducts.length === 0) {
    setError("Please select at least one product.");
    return;
  }

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiBase}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        units: Number(form.units),
        source: "website",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Could not submit your enquiry.");
      return;
    }

    setSubmissionReference(result.data.id);
    setSubmitted(true);
  } catch {
    setError(
      "Unable to reach the server. Check that the backend is running and try again."
    );
  }
}

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#dce1d5] bg-white px-4 py-3 text-sm text-[#244733] outline-none transition focus:border-[#55795d] focus:ring-2 focus:ring-[#55795d]/10";

  const labelClass = "block text-sm font-medium text-[#244733]";

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f4] px-5 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-[#e3e5da] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8eddf] text-3xl text-[#244733]">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-[#244733]">
            Form validation successful!
          </h1>

       <p className="mt-4 text-sm leading-7 text-[#6b7468]">
  Your enquiry has been saved successfully. Our team can review
  your requirements and follow up with you.
</p>

{submissionReference && (
  <p className="mt-3 text-xs text-[#85897e]">
    Enquiry reference: {submissionReference}
  </p>
)}

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-7 rounded-full bg-[#244733] px-6 py-3 text-sm font-semibold text-white hover:bg-[#355e43]"
          >
            Back to form
          </button>

          <div>
            <Link
              href="/"
              className="mt-5 inline-block text-sm text-[#536b51] underline"
            >
              Return to homepage
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      <header className="border-b border-[#e8e5db] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
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

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-9 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#99834a]">
            LET&apos;S PLAN SOMETHING THOUGHTFUL
          </p>

          <h1 className="mt-4 text-3xl font-medium tracking-tight text-[#244733] sm:text-5xl">
            Tell us about your gifting needs.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6b7468] sm:text-base">
            Share a few details about your team, occasion and budget. We can
            use them to plan suitable corporate gifts and customisation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-[#e3e5da] bg-white p-5 shadow-sm sm:p-9"
        >
          <section>
            <h2 className="text-lg font-semibold text-[#244733]">
              01. Your details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full name *
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label className={labelClass}>
                Company name *
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
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
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                  required
                />
              </label>

              <label className={labelClass}>
                Work email *
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
          </section>

          <div className="border-t border-[#e8e5db]" />

          <section>
            <h2 className="text-lg font-semibold text-[#244733]">
              02. Your gifting requirements
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Occasion *
                <select
                  className={inputClass}
                  value={form.occasion}
                  onChange={(e) => updateField("occasion", e.target.value)}
                  required
                >
                  <option value="">Select an occasion</option>
                  {occasions.map((occasion) => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Number of units *
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  step={1}
                  value={form.units}
                  onChange={(e) => updateField("units", e.target.value)}
                  placeholder="e.g. 100"
                  required
                />
              </label>

              <label className={labelClass}>
                Budget per unit *
                <select
                  className={inputClass}
                  value={form.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  required
                >
                  <option value="">Select your budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Expected delivery date *
                <input
                  className={inputClass}
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) =>
                    updateField("deliveryDate", e.target.value)
                  }
                  required
                />
              </label>
            </div>

            <fieldset className="mt-7">
              <legend className={labelClass}>
                Select products * (choose one or more)
              </legend>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <label
                    key={product.value}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e3e5da] p-3 text-sm text-[#53624f] transition hover:border-[#92a58b]"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-[#244733]"
                      checked={form.selectedProducts.includes(product.value)}
                      onChange={() =>
                        toggleOption("selectedProducts", product.value)
                      }
                    />
                    <span>{product.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <div className="border-t border-[#e8e5db]" />

          <section>
            <h2 className="text-lg font-semibold text-[#244733]">
              03. Customisation and additional details
            </h2>

            <fieldset className="mt-5">
              <legend className={labelClass}>
                Customisation preferences
              </legend>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {customisationOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e3e5da] p-3 text-sm text-[#53624f]"
                  >
                    <input
                      type="checkbox"
                      className="accent-[#244733]"
                      checked={form.customisation.includes(option)}
                      onChange={() => toggleOption("customisation", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={`${labelClass} mt-6`}>
              Additional message
              <textarea
                className={inputClass}
                rows={5}
                maxLength={2000}
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Tell us about branding, packaging, delivery locations or any special requirements."
              />
            </label>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[#244733] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#355e43] sm:w-auto"
          >
            Review enquiry details →
          </button>

          <p className="text-xs leading-5 text-[#85897e]">
            * Required fields. 
          </p>
        </form>
      </div>
    </main>
  );
}
