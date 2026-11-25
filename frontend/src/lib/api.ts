const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiOptions = RequestInit;

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(formatApiError(data, response.status));
  }

  return data as T;
}

function formatApiError(data: unknown, status: number): string {
  const fallbackMessage = `Request failed with status ${status}`;
  if (!data || typeof data !== "object" || !("detail" in data)) {
    return fallbackMessage;
  }

  const detail = data.detail;
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail.map((item) => {
      if (!item || typeof item !== "object") {
        return String(item);
      }

      const validationError = item as { loc?: unknown; msg?: unknown };
      const message =
        typeof validationError.msg === "string"
          ? validationError.msg
          : JSON.stringify(item);
      const location = Array.isArray(validationError.loc)
        ? validationError.loc
            .slice(1)
            .filter(
              (part): part is string | number =>
                typeof part === "string" || typeof part === "number",
            )
            .join(".")
        : "";

      return location ? `${location}: ${message}` : message;
    });

    return messages.join("; ") || fallbackMessage;
  }

  if (detail !== undefined && detail !== null) {
    return typeof detail === "object" ? JSON.stringify(detail) : String(detail);
  }

  return fallbackMessage;
}
