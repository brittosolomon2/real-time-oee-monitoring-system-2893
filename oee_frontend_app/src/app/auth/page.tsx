"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faAt,
  faLock,
  faUserPlus,
  faRightToBracket,
  faShieldHalved,
  faCircleCheck,
  faTriangleExclamation,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@/lib/api/client";
import { createUser, login, type AuthUser } from "@/lib/api/authApi";
import { setAccessToken } from "@/lib/auth/token";

type Mode = "login" | "signup";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function isValidEmail(email: string): boolean {
  const e = String(email || "").trim();
  // Simple, sufficient validation for UI
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-2">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4" />
        <div>{message}</div>
      </div>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 h-4 w-4" />
        <div>{message}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
        <FontAwesomeIcon icon={icon} className="h-4 w-4 text-slate-400" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: AuthUser["role"] }) {
  const styles: Record<AuthUser["role"], string> = {
    operator: "bg-blue-50 text-blue-700 ring-blue-100",
    supervisor: "bg-amber-50 text-amber-900 ring-amber-100",
    manager: "bg-slate-50 text-slate-800 ring-slate-200",
  };

  return (
    <span className={classNames("rounded-full px-2 py-1 text-xs font-semibold ring-1", styles[role])}>
      {role}
    </span>
  );
}

export default function AuthPage() {
  const reduced = useReducedMotion();
  const [mode, setMode] = React.useState<Mode>("login");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Login
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  // Signup (manager-only on backend)
  const [signupForm, setSignupForm] = React.useState({
    email: "",
    password: "",
    role: "operator" as AuthUser["role"],
  });

  function toMessage(e: unknown): string {
    if (e instanceof ApiError) return e.message;
    if (e instanceof Error) return e.message;
    return "Something went wrong.";
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const email = loginForm.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!loginForm.password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password: loginForm.password });
      setAccessToken(res.access_token);
      setSuccess(`Welcome back. Signed in as ${res.user.email}.`);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const email = signupForm.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!signupForm.password || signupForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const created = await createUser({
        email,
        password: signupForm.password,
        role: signupForm.role,
      });

      setSuccess(
        `User created: ${created.email} (${created.role}). Now sign in with the new credentials.`
      );

      // Shift to login with the created email prefilled.
      setMode("login");
      setLoginForm((p) => ({ ...p, email }));
    } catch (err) {
      setError(
        `${toMessage(err)}${
          err instanceof ApiError && err.status === 403
            ? " Your current token is not a manager token. Sign in as a manager to create users."
            : ""
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  const panel = {
    leftTitle: mode === "login" ? "Sign in" : "Create a user",
    leftSubtitle:
      mode === "login"
        ? "Use your credentials to access protected OEE endpoints."
        : "User creation is restricted to managers (RBAC enforced server-side).",
    rightTitle: "Ocean Professional OEE",
    rightSubtitle:
      "A modern, secure OEE experience for operators, supervisors, and plant managers.",
  };

  const slide = reduced
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 26 };

  return (
    <div className="min-h-[calc(100dvh-220px)]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-700">Authentication</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Secure access to OEE tools
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              The backend protects operational endpoints with JWT bearer auth. Sign in
              to store a token locally, then use the app normally.
            </p>
          </div>

          <Link href="/" className="btn btn-secondary">
            Back to landing
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form Panel */}
            <div className="p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{panel.leftTitle}</h2>
                  <p className="mt-1 text-sm text-slate-600">{panel.leftSubtitle}</p>
                </div>
                <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700 ring-1 ring-blue-100">
                  <FontAwesomeIcon
                    icon={mode === "login" ? faRightToBracket : faUserPlus}
                    className="h-5 w-5"
                  />
                </div>
              </div>

              <div className="mt-6">
                {error ? <ErrorBanner message={error} /> : null}
                {success ? <SuccessBanner message={success} /> : null}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={classNames(
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      mode === "login"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white/60"
                    )}
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setSuccess(null);
                    }}
                    aria-pressed={mode === "login"}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      mode === "signup"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white/60"
                    )}
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setSuccess(null);
                    }}
                    aria-pressed={mode === "signup"}
                  >
                    Create user
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: reduced ? 0 : -12 }}
                      animate={{ opacity: 1, x: 0, transition: slide }}
                      exit={{ opacity: 0, x: reduced ? 0 : 12, transition: { duration: 0.12 } }}
                    >
                      <form className="space-y-4" onSubmit={onLogin}>
                        <Field label="Email" icon={faAt}>
                          <input
                            className="h-10 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="manager@example.com"
                            autoComplete="email"
                            inputMode="email"
                          />
                        </Field>

                        <Field label="Password" icon={faLock}>
                          <input
                            className="h-10 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm((p) => ({ ...p, password: e.target.value }))
                            }
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                          />
                        </Field>

                        <div className="pt-1">
                          <button className="btn btn-primary w-full" disabled={loading} type="submit">
                            {loading ? "Signing in…" : "Sign in"}
                            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-blue-700">
                              <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Protected endpoints</p>
                              <p className="mt-1 text-sm text-slate-600">
                                After sign-in, the JWT is stored locally and automatically added to
                                API requests (Authorization: Bearer).
                              </p>
                            </div>
                          </div>
                        </div>

                        {success ? (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Link href="/runs" className="btn btn-primary w-full sm:w-auto">
                              Go to Runs
                              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                            </Link>
                            <Link href="/reference" className="btn btn-secondary w-full sm:w-auto">
                              Reference data
                            </Link>
                          </div>
                        ) : null}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: reduced ? 0 : 12 }}
                      animate={{ opacity: 1, x: 0, transition: slide }}
                      exit={{ opacity: 0, x: reduced ? 0 : -12, transition: { duration: 0.12 } }}
                    >
                      <form className="space-y-4" onSubmit={onSignup}>
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <FontAwesomeIcon icon={faUserGear} className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Manager-required</p>
                              <p className="mt-1 text-sm text-amber-800">
                                This screen creates users via the backend{" "}
                                <span className="font-mono">/api/auth/users</span> endpoint, which
                                requires a manager token.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Field label="Email" icon={faAt}>
                          <input
                            className="h-10 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                            value={signupForm.email}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, email: e.target.value }))
                            }
                            placeholder="new.user@example.com"
                            autoComplete="email"
                            inputMode="email"
                          />
                        </Field>

                        <Field label="Password (min 8 chars)" icon={faLock}>
                          <input
                            className="h-10 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                            value={signupForm.password}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, password: e.target.value }))
                            }
                            placeholder="Create a strong password"
                            type="password"
                            autoComplete="new-password"
                          />
                        </Field>

                        <div>
                          <p className="label">Role</p>
                          <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {(["operator", "supervisor", "manager"] as const).map((r) => (
                              <button
                                key={r}
                                type="button"
                                className={classNames(
                                  "flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition",
                                  signupForm.role === r
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                                )}
                                onClick={() => setSignupForm((p) => ({ ...p, role: r }))}
                                aria-pressed={signupForm.role === r}
                              >
                                <span className="capitalize">{r}</span>
                                <RoleBadge role={r} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-1">
                          <button className="btn btn-primary w-full" disabled={loading} type="submit">
                            {loading ? "Creating user…" : "Create user"}
                            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                          </button>
                          <p className="mt-2 text-xs text-slate-600">
                            After creation, sign in with the new email/password.
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Brand/Info Panel */}
            <div className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white sm:p-10 lg:border-l lg:border-t-0">
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{panel.rightTitle}</p>
                    <p className="text-xs text-white/80">{panel.rightSubtitle}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      title: "JWT bearer auth",
                      desc: "Tokens are attached automatically to protected endpoints once signed in.",
                    },
                    {
                      title: "Role-based workflows",
                      desc: "Operators, supervisors, and managers each get the tools they need.",
                    },
                    {
                      title: "Fast operational loops",
                      desc: "Capture events immediately; compute OEE consistently; act on issues quickly.",
                    },
                  ].map((x) => (
                    <div
                      key={x.title}
                      className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
                    >
                      <p className="text-sm font-semibold">{x.title}</p>
                      <p className="mt-1 text-sm text-white/80">{x.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                    Quick links
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <Link href="/settings" className="text-sm font-semibold text-white hover:underline">
                      API base URL configuration
                    </Link>
                    <Link href="/docs" className="text-sm font-semibold text-white hover:underline">
                      Backend docs (if hosted)
                    </Link>
                    <Link href="/reference" className="text-sm font-semibold text-white hover:underline">
                      Reference data
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative blobs */}
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          Tip: If you see network/CORS errors, confirm{" "}
          <code className="rounded bg-white px-1 py-0.5 ring-1 ring-slate-200">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          points to the backend origin (no trailing slash).
        </p>
      </div>
    </div>
  );
}
