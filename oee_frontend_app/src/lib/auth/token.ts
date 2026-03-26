"use client";

const TOKEN_STORAGE_KEY = "oee.access_token";

/**
 * PUBLIC_INTERFACE
 * Returns the stored JWT access token if present (client-side only).
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Store a JWT access token (client-side only).
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors (private mode, blocked, etc.)
  }
}

/**
 * PUBLIC_INTERFACE
 * Clears the stored JWT token (client-side only).
 */
export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
