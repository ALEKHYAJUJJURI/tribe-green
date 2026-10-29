import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-3 text-gray-600">Page not found.</p>
      <Link to="/" className="mt-5 text-green-800 underline">
        Return home
      </Link>
    </main>
  );
}