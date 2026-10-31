    import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminService";


const inputClass =
  "mt-2 w-full rounded-xl border border-[#E7DFCB] bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/15";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await adminLogin(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6EE] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center" aria-label="Tribe Green">
          <img src="/logo-lockup.svg" alt="Tribe Green" className="h-10 w-auto" />
        </Link>

        <div className="rounded-3xl border border-[#EFE8D8] bg-white p-6 shadow-xl shadow-[#14532D]/5 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
            Admin panel
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900">
            Sign in
          </h1>
          <div className="mt-3 h-[3px] w-10 rounded-full bg-[#B8924A]" />

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-stone-700">
              Email
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-stone-700">
              Password
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#14532D] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#14532D]/20 transition hover:bg-[#0F3D22] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-semibold text-[#14532D] hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}