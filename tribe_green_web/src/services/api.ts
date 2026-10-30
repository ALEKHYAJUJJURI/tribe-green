
const API_BASE_URL ="https://tribe-green-8iw2.vercel.app";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const url = `${API_BASE_URL}${endpoint}`;

  console.log("API Request:", url);

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseText = await response.text();

  let data: any;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Server returned an invalid response. Status: ${response.status}. Response: ${responseText.slice(0, 200)}`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  console.log("API Response:", data);

  return data as T;
}
