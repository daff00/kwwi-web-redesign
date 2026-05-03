const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type FetchOptions = RequestInit & {
  token?: string;
};

type ContactSubmission = {
  formType: "general_inquiry" | "get_quote";
  tab?: "inquiry" | "quote";
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  port?: string;
  productTypes?: string[];
  customSpec?: string;
  thickness?: string;
  width?: string;
  length?: string;
  quantity?: string;
  delivery?: string;
  incoterm?: string;
  message: string;
};

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  return res.json();
}

export const api = {
  // Products
  getProducts: () =>
    apiFetch<{ id: string; name: string; description: string; image_url: string | null; created_at: string; updated_at: string }[]>('/api/products'),

  getProductById: (id: string) =>
    apiFetch<{ id: string; name: string; description: string; image_url: string | null; created_at: string; updated_at: string }>(`/api/products/${id}`),

  createProduct: (formData: FormData, token: string) =>
    apiFetch('/api/products', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
      // Don't set Content-Type — browser sets it with boundary for FormData
    }),

  updateProduct: (id: string, data: Record<string, string>, token: string) =>
    apiFetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  deleteProduct: (id: string, token: string) =>
    apiFetch(`/api/products/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Contact
  submitContact: (data: ContactSubmission) =>
    apiFetch<{ message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};