// Base URL for admin calls. Set VITE_ADMIN_API_URL to an empty string to use
// same-origin "/api/..." (for example behind a Vercel rewrite).
const BASE ="https://tribe-green-8iw2.vercel.app"

export const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Converted",
  "Lost",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface AdminEnquiry {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  occasion: string;
  units: number;
  budget: string;
  deliveryDate?: string;
  selectedProducts: string[];
  customisation: string[];
  message: string;
  source: "website" | "android";
  status: EnquiryStatus;
  createdAt?: string;
}

/** Thrown when the API answers 401 (not logged in or session expired). */
export class AdminAuthError extends Error {
  constructor() {
    super("Your session has expired. Please log in again.");
    this.name = "AdminAuthError";
  }
}

async function adminFetch(path: string, init: RequestInit = {}) {
  try {
    return await fetch(`${BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }
}

async function readBody(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function failure(response: Response, body: { message?: string } | null) {
  if (response.status === 401) return new AdminAuthError();
  return new Error(body?.message ?? `Request failed (${response.status})`);
}

export async function adminLogin(email: string, password: string) {
  const response = await adminFetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const body = await readBody(response);

  if (!response.ok || body?.success === false) {
    // A 401 here means wrong credentials, so show the server's message.
    throw new Error(body?.message ?? "Unable to log in. Please try again.");
  }
}

export async function getEnquiries(): Promise<AdminEnquiry[]> {
  const response = await adminFetch("/api/enquiries");
  const body = await readBody(response);

  if (!response.ok || body?.success === false) throw failure(response, body);
  return body?.data ?? [];
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<AdminEnquiry> {
  const response = await adminFetch(
    `/api/enquiries/${encodeURIComponent(id)}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) }
  );
  const body = await readBody(response);

  if (!response.ok || body?.success === false) throw failure(response, body);
  return body.data;
}

export async function downloadEnquiriesCsv() {
  const response = await adminFetch("/api/enquiries/export.csv");

  if (!response.ok) {
    throw failure(response, await readBody(response));
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
}

export async function adminLogout() {
  const response = await adminFetch("/api/admin/logout", { method: "POST" });
  if (!response.ok) throw failure(response, await readBody(response));
}