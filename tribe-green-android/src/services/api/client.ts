export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://tribe-green-8iw2.vercel.app/api";

const TIMEOUT_MS = 15000;

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      signal: controller.signal,
    });

    let body: ApiEnvelope<T> | null = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok || body?.success === false) {
      throw new ApiError(
        body?.message ?? `Request failed (${response.status})`,
        response.status
      );
    }

    return body?.data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.");
    }
    throw new ApiError("Network error. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}