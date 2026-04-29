const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    document.cookie = "access_token=; max-age=0; path=/";
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request gagal");
  return data as T;
}

export interface SalesItem {
  product_id: string;
  product_name: string;
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
  status: string;
}

export interface SalesResponse {
  total: number;
  page: number;
  page_size: number;
  data: SalesItem[];
}

export interface PredictRequest {
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
}

export interface PredictResponse {
  status: string;
  probability_laris: number;
  probability_tidak: number;
}

export const api = {
  getSales: (page = 1, pageSize = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (status) params.set("status", status);
    return request<SalesResponse>(`/sales?${params}`);
  },
  predict: (body: PredictRequest) =>
    request<PredictResponse>("/predict", { method: "POST", body: JSON.stringify(body) }),
};
