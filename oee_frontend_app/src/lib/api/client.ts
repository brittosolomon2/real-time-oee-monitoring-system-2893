export type ApiEnvelope<T> = { data: T };
export type ApiErrorEnvelope = { status?: string; message?: string };

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * PUBLIC_INTERFACE
 * Returns the backend base URL from env, with a safe local-dev fallback.
 * Configure via NEXT_PUBLIC_API_BASE_URL in the environment.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();

  // Fallback: local dev default. For deployed environments, set NEXT_PUBLIC_API_BASE_URL.
  return "http://localhost:3001";
}

async function parseMaybeJson(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  const text = await res.text();
  return text ? { message: text } : null;
}

async function request<T>(
  path: string,
  init?: RequestInit & { baseUrl?: string }
): Promise<T> {
  const baseUrl = init?.baseUrl ?? getApiBaseUrl();
  const url = joinUrl(baseUrl, path);

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // Avoid Next.js caching for live-ish operational data.
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await parseMaybeJson(res);
    const message =
      (payload as ApiErrorEnvelope | null)?.message ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  // Some endpoints may return empty body; handle gracefully.
  const payload = await parseMaybeJson(res);
  return payload as T;
}

/**
 * PUBLIC_INTERFACE
 * Performs a GET request and returns parsed JSON.
 */
export async function apiGet<T>(path: string, baseUrl?: string): Promise<T> {
  return request<T>(path, { method: "GET", baseUrl });
}

/**
 * PUBLIC_INTERFACE
 * Performs a POST request with a JSON body and returns parsed JSON.
 */
export async function apiPost<TResponse, TBody extends object>(
  path: string,
  body: TBody,
  baseUrl?: string
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
    baseUrl,
  });
}
