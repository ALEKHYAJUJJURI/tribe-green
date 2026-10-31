import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  AdminAuthError,
  ENQUIRY_STATUSES,
  adminLogout,
  downloadEnquiriesCsv,
  getEnquiries,
  updateEnquiryStatus,
  type AdminEnquiry,
  type EnquiryStatus,
} from "../../services/adminService";
import { getProducts } from "../../services/productService";
// import { getProducts } from "../services/productService";

const statusStyles: Record<EnquiryStatus, string> = {
  New: "border-[#E3C98F] bg-[#F3E9D2] text-[#8A6A2B]",
  Contacted: "border-sky-200 bg-sky-50 text-sky-800",
  Converted: "border-[#D9E8DC] bg-[#F1F7F2] text-[#14532D]",
  Lost: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: EnquiryStatus;
  disabled: boolean;
  onChange: (status: EnquiryStatus) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as EnquiryStatus)}
      aria-label="Enquiry status"
      className={`min-h-[40px] rounded-full border px-3 py-2 text-xs font-bold outline-none transition focus:ring-2 focus:ring-[#14532D]/20 disabled:opacity-60 ${statusStyles[value]}`}
    >
      {ENQUIRY_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold capitalize text-stone-600">
      {source}
    </span>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | EnquiryStatus>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

//   const handleError = useCallback(
//     (err: unknown) => {
//       if (err instanceof AdminAuthError) {
//         navigate("/admin/login", { replace: true });
//         return;
//       }
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     },
//     [navigate]
//   );

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setEnquiries(await getEnquiries());
    } catch (err) {
    console.log(err)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  // Product names are only used to make slugs readable.
  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((response) => {
        if (cancelled || !response.success) return;
        setProductNames(
          Object.fromEntries(response.data.map((p) => [p.slug, p.name]))
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: enquiries.length };
    ENQUIRY_STATUSES.forEach((status) => {
      result[status] = enquiries.filter((e) => e.status === status).length;
    });
    return result;
  }, [enquiries]);

  const visible = useMemo(
    () =>
      filter === "All"
        ? enquiries
        : enquiries.filter((e) => e.status === filter),
    [enquiries, filter]
  );

  const productLabel = (item: AdminEnquiry) =>
    (item.selectedProducts ?? [])
      .map((slug) => productNames[slug] ?? slug)
      .join(", ") || "—";

  async function handleStatusChange(id: string, status: EnquiryStatus) {
    try {
      setUpdatingId(id);
      setError("");
      const updated = await updateEnquiryStatus(id, status);
      setEnquiries((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status: updated.status } : item
        )
      );
    } catch (err) {
      console.log(err)
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleExport() {
    try {
      setExporting(true);
      setError("");
      await downloadEnquiriesCsv();
    } catch (err) {
      console.log(err);
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await adminLogout();
    } catch {
      // Leave the admin area either way.
    } finally {
      setLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <AdminLayout onLogout={handleLogout} loggingOut={loggingOut}>
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8A6A2B]">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
              Enquiries
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Leads from the website and the Android app.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadEnquiries()}
              disabled={loading}
              className="min-h-[44px] rounded-full border border-[#14532D] bg-white px-5 text-sm font-semibold text-[#14532D] transition hover:bg-[#F1F7F2] disabled:opacity-60"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="min-h-[44px] rounded-full bg-[#14532D] px-5 text-sm font-semibold text-white shadow-lg shadow-[#14532D]/20 transition hover:bg-[#0F3D22] disabled:opacity-60"
            >
              {exporting ? "Preparing..." : "Download CSV"}
            </button>
          </div>
        </div>

        {/* Status filters */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(["All", ...ENQUIRY_STATUSES] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`rounded-2xl border p-4 text-left transition ${
                filter === item
                  ? "border-[#14532D] bg-[#14532D] text-white"
                  : "border-[#EFE8D8] bg-white text-stone-700 hover:border-[#14532D]/50"
              }`}
            >
              <span className="block text-2xl font-extrabold">
                {counts[item] ?? 0}
              </span>
              <span
                className={`text-xs font-semibold ${
                  filter === item ? "text-green-100" : "text-stone-500"
                }`}
              >
                {item}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="mt-6 space-y-3" aria-label="Loading enquiries">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl bg-[#EFE8D8]/60"
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#EFE8D8] bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-stone-900">
              No enquiries found
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {filter === "All"
                ? "New enquiries will appear here."
                : `There are no enquiries marked ${filter}.`}
            </p>
          </div>
        ) : (
          <>
            {/* Table (tablet and desktop) */}
            <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-[#EFE8D8] bg-white md:block">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="border-b border-[#EFE8D8] bg-[#FDFBF7] text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Request</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EEE0]">
                  {visible.map((item) => (
                    <tr key={item._id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-4 text-stone-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-stone-600">{item.company}</p>
                        <a
                          href={`tel:${item.phone}`}
                          className="block text-[#14532D] hover:underline"
                        >
                          {item.phone}
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="block break-all text-[#14532D] hover:underline"
                        >
                          {item.email}
                        </a>
                      </td>
                      <td className="max-w-xs px-4 py-4 text-stone-600">
                        <p className="font-semibold text-stone-800">
                          {item.occasion}
                        </p>
                        <p>
                          {item.units} units · {item.budget}
                        </p>
                        <p>Delivery: {formatDate(item.deliveryDate)}</p>
                        {item.customisation?.length > 0 && (
                          <p>Customisation: {item.customisation.join(", ")}</p>
                        )}
                        {item.message && (
                          <p className="mt-1 text-stone-500">“{item.message}”</p>
                        )}
                      </td>
                      <td className="max-w-[200px] px-4 py-4 text-stone-600">
                        {productLabel(item)}
                      </td>
                      <td className="px-4 py-4">
                        <SourceBadge source={item.source} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusSelect
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(status) =>
                            void handleStatusChange(item._id, status)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="mt-6 space-y-4 md:hidden">
              {visible.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-[#EFE8D8] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-sm text-stone-600">{item.company}</p>
                    </div>
                    <SourceBadge source={item.source} />
                  </div>

                  <div className="mt-3 space-y-1 text-sm">
                    <a
                      href={`tel:${item.phone}`}
                      className="block text-[#14532D]"
                    >
                      {item.phone}
                    </a>
                    <a
                      href={`mailto:${item.email}`}
                      className="block break-all text-[#14532D]"
                    >
                      {item.email}
                    </a>
                  </div>

                  <dl className="mt-3 space-y-1 border-t border-[#F3EEE0] pt-3 text-sm text-stone-600">
                    <div>
                      <dt className="inline font-semibold text-stone-800">
                        Occasion:{" "}
                      </dt>
                      <dd className="inline">{item.occasion}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-stone-800">
                        Quantity:{" "}
                      </dt>
                      <dd className="inline">
                        {item.units} units · {item.budget}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-stone-800">
                        Delivery:{" "}
                      </dt>
                      <dd className="inline">{formatDate(item.deliveryDate)}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-stone-800">
                        Products:{" "}
                      </dt>
                      <dd className="inline">{productLabel(item)}</dd>
                    </div>
                    {item.customisation?.length > 0 && (
                      <div>
                        <dt className="inline font-semibold text-stone-800">
                          Customisation:{" "}
                        </dt>
                        <dd className="inline">
                          {item.customisation.join(", ")}
                        </dd>
                      </div>
                    )}
                    {item.message && (
                      <div>
                        <dt className="inline font-semibold text-stone-800">
                          Message:{" "}
                        </dt>
                        <dd className="inline">{item.message}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      {formatDate(item.createdAt)}
                    </span>
                    <StatusSelect
                      value={item.status}
                      disabled={updatingId === item._id}
                      onChange={(status) =>
                        void handleStatusChange(item._id, status)
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}