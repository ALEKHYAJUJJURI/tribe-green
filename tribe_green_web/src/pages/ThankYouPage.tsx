import { Link, useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const enquiryId = (location.state as { enquiryId?: string | number } | null)
    ?.enquiryId;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF6EE] px-5 py-16 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F1F7F2]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14532D]">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
        Enquiry received
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#14532D] sm:text-4xl">
        Thank you for your enquiry!
      </h1>

      <div className="mt-4 h-[3px] w-12 rounded-full bg-[#B8924A]" />

      <p className="mt-5 max-w-md leading-7 text-stone-600">
        Our team will review your requirements and get in touch with you soon.
      </p>

      {enquiryId !== undefined && (
        <p className="mt-5 rounded-full border border-[#E7DFCB] bg-white px-4 py-2 text-xs font-medium text-stone-500">
          Reference: <span className="font-bold text-stone-800">{enquiryId}</span>
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-full bg-[#14532D] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#14532D]/20 transition hover:bg-[#0F3D22]"
        >
          Back to Home
        </Link>
        <a
          href="/#products"
          className="rounded-full border border-[#14532D] bg-white px-7 py-3.5 font-semibold text-[#14532D] transition hover:bg-[#F1F7F2]"
        >
          Browse more gifts
        </a>
      </div>
    </main>
  );
}