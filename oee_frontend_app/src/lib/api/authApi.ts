import { apiPost, type ApiEnvelope } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  role: "operator" | "supervisor" | "manager";
};

export type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: AuthUser;
};

export type LoginInput = { email: string; password: string };

export type CreateUserInput = {
  email: string;
  password: string;
  role: AuthUser["role"];
};

/**
 * PUBLIC_INTERFACE
 * Login with email/password and receive a JWT access token.
 */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await apiPost<ApiEnvelope<LoginResponse>, LoginInput>(
    "/api/auth/login",
    input
  );
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Create a user (manager only). This is used by the Sign Up UI.
 *
 * Note: The backend enforces RBAC; non-manager tokens will receive 403.
 */
export async function createUser(input: CreateUserInput): Promise<AuthUser> {
  const res = await apiPost<ApiEnvelope<AuthUser>, CreateUserInput>(
    "/api/auth/users",
    input
  );
  return res.data;
}
