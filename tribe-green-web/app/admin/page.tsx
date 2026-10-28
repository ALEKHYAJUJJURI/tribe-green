
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Enquiry = {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: number;
  budget: string;
  deliveryDate: string;
  selectedProducts: string[];
  customisation: string[];
  message?: string;
  source: "website" | "android";
  status: "New" | "Contacted" | "Converted" | "Lost";
  createdAt: string;
};

const STATUSES = ["New", "Contacted", "Converted", "Lost"] as const;

const API_BASE =
  process.env.BACKEND_API_URL || "http://localhost:5000";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [exporting, setExporting] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/enquiries`, {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load enquiries.");
      }

      setEnquiries(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  const filteredEnquiries =
    filter === "All"
      ? enquiries
      : enquiries.filter((item) => item.status === filter);

  const counts = {
    total: enquiries.length,
    New: enquiries.filter((item) => item.status === "New").length,
    Contacted: enquiries.filter((item) => item.status === "Contacted").length,
    Converted: enquiries.filter((item) => item.status === "Converted").length,
    Lost: enquiries.filter((item) => item.status === "Lost").length,
  };

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/enquiries/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Could not update status.");
      }

      setEnquiries((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status: result.data.status } : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update status."
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function exportCSV() {
    setExporting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/enquiries/export.csv`,
        { credentials: "include" }
      );

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to export enquiries.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "tribe-green-enquiries.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "CSV export failed."
      );
    } finally {
      setExporting(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/admin/login");
    }
  }

  function formatDate(value: string) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN");
  }

  return (
    <main className="min-h-screen bg-[#f7f6f0] px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">
              Tribe Green
            </p>
            <h1 className="mt-2 text-3xl font-bold">Enquiry Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your corporate gifting enquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void loadEnquiries()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={() => void exportCSV()}
              disabled={exporting}
              className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-60"
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={() => void logout()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total Enquiries", value: counts.total },
            { label: "New", value: counts.New },
            { label: "Contacted", value: counts.Contacted },
            { label: "Converted", value: counts.Converted },
            { label: "Lost", value: counts.Lost },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">All Enquiries</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredEnquiries.length} enquiry
                {filteredEnquiries.length === 1 ? "" : "ies"}
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filter enquiries by status"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="p-8 text-center text-gray-500">
              Loading enquiries...
            </p>
          ) : filteredEnquiries.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No enquiries found for this filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Occasion</th>
                    <th className="px-5 py-4">Products</th>
                    <th className="px-5 py-4">Quantity / Budget</th>
                    <th className="px-5 py-4">Delivery</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredEnquiries.map((item) => (
                    <tr key={item._id} className="align-top hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-600">{item.company}</p>
                        <a
                          href={`mailto:${item.email}`}
                          className="mt-1 block text-green-800 hover:underline"
                        >
                          {item.email}
                        </a>
                        <a
                          href={`tel:${item.phone}`}
                          className="mt-1 block text-gray-600 hover:underline"
                        >
                          {item.phone}
                        </a>
                        <p className="mt-2 text-xs text-gray-400">
                          Submitted {formatDate(item.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">{item.occasion}</td>

                      <td className="max-w-xs px-5 py-4">
                        <p>{item.selectedProducts?.join(", ") || "—"}</p>
                        {item.customisation?.length > 0 && (
                          <p className="mt-2 text-xs text-gray-500">
                            Custom: {item.customisation.join(", ")}
                          </p>
                        )}
                        {item.message && (
                          <p className="mt-2 whitespace-pre-wrap text-xs text-gray-500">
                            {item.message}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p>{item.units} units</p>
                        <p className="mt-1 text-gray-500">{item.budget}</p>
                      </td>

                      <td className="px-5 py-4">
                        {formatDate(item.deliveryDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                          {item.source}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(event) =>
                            void updateStatus(item._id, event.target.value)
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
                          aria-label={`Status for ${item.company}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingId === item._id && (
                          <p className="mt-1 text-xs text-gray-500">
                            Saving...
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
