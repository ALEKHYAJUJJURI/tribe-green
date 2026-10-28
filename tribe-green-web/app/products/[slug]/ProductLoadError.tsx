"use client";

export default function ProductLoadError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f4] px-5">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#244733]">
          We couldn't load this product
        </h1>

        <p className="mt-4 leading-7 text-[#6b7468]">
          We're having trouble connecting to our product catalogue.
          Please check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-[#244733] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#355e43]"
        >
          Try again
        </button>

        <a
          href="/#catalogue"
          className="ml-4 inline-block text-sm font-medium text-[#244733] hover:underline"
        >
          Back to collection
        </a>
      </div>
    </main>
  );
}