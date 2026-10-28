import type { Metadata } from "next";
import { Suspense } from "react";
import EnquiryForm from "./EnquiryForm";

export const metadata: Metadata = {
  title: "Corporate Gifting Enquiry | Tribe Green",
  description:
    "Tell Tribe Green about your corporate gifting requirements, budget, quantity and delivery date.",
};

export default function EnquiryPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9f4] text-[#244733]">
          Loading enquiry form...
        </main>
      }
    >
      <EnquiryForm />
    </Suspense>
  );
}