import { Link } from "react-router-dom";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-3xl font-bold text-green-800">
        Thank you for your enquiry!
      </h1>
      <p className="mt-3 text-gray-600">
        Your enquiry confirmation page will be completed when we integrate the API.
      </p>
      <Link to="/" className="mt-6 rounded-lg bg-green-800 px-5 py-3 text-white">
        Back to Home
      </Link>
    </main>
  );
}