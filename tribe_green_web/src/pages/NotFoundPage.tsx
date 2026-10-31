import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FAF6EE] px-5 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
        Error 404
      </p>

      <h1 className="mt-2 text-6xl font-extrabold text-[#14532D] sm:text-7xl">
        404
      </h1>

      <div className="mt-4 h-[3px] w-12 rounded-full bg-[#B8924A]" />

      <p className="mt-5 text-stone-600">
        The page you're looking for doesn't exist or has moved.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-full bg-[#14532D] px-7 py-3.5 font-semibold text-white transition hover:bg-[#0F3D22]"
      >
        Return home
      </Link>
    </main>
  );
}