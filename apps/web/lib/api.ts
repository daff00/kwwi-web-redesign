const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type FetchOptions = RequestInit & {
  token?: string;
};

export type ContactSubmission = {
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

type ApiErrorResponse = {
  error?: string;
  details?: unknown;
  message?: string;
};

function formatApiError(payload: ApiErrorResponse, status: number) {
  if (payload.error === "Validation error" && payload.details) {
    if (
      typeof payload.details === "object" &&
      payload.details !== null &&
      !Array.isArray(payload.details)
    ) {
      const entries = Object.entries(payload.details as Record<
        string,
        unknown
      >);
      const fieldMessages = entries.flatMap(([field, messages]) => {
        if (!Array.isArray(messages)) return [];
        return messages
          .filter((message): message is string => typeof message === "string")
          .map((message) =>
            field === "message" ? message : `${field}: ${message}`
          );
      });

      if (fieldMessages.length > 0) {
        return fieldMessages
          .map((message) => {
            const [rawField, ...rest] = message.includes(": ")
              ? message.split(": ")
              : ["", message];
            const fieldLabel = rawField
              ? rawField.charAt(0).toUpperCase() + rawField.slice(1)
              : "Message";
            const detail = rest.join(": ");

            return `${fieldLabel}\n${detail || message}`;
          })
          .join("\n\n");
      }
    }

    return "Please check the highlighted fields.";
  }

  if (typeof payload.details === "string" && payload.details.trim()) {
    return payload.details;
  }

  return payload.message || payload.error || `HTTP ${status}`;
}

async function readErrorPayload(res: Response): Promise<ApiErrorResponse> {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await res.json().catch(() => ({}))) as ApiErrorResponse;
  }

  const text = await res.text().catch(() => "");
  return text ? { error: text } : {};
}

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
    const error = await readErrorPayload(res);
    throw new Error(formatApiError(error, res.status));
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  return res.json();
}

export const api = {
  // Contact
  submitContact: (data: ContactSubmission) =>
    apiFetch<{ message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
