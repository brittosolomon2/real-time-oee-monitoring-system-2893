"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems: Array<{ href: string; label: string; description: string }> = [
  { href: "/", label: "Dashboard", description: "Live OEE overview" },
  { href: "/reference", label: "Reference", description: "Lines and shifts" },
  { href: "/runs", label: "Runs", description: "Create & manage production runs" },
  { href: "/events", label: "Events", description: "Log downtime and quality" },
  { href: "/oee", label: "OEE", description: "OEE breakdown for a run" },
  { href: "/settings", label: "Settings", description: "API configuration help" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-blue-600" : "bg-slate-300",
        ].join(" ")}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}

/**
 * PUBLIC_INTERFACE
 * Shared application shell with Ocean Professional styling.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-500/10 to-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center shadow-sm">
              <span className="text-sm font-bold">OEE</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ocean Professional OEE
              </p>
              <p className="text-xs text-slate-600">
                Real-time run logging & effectiveness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-slate-600">
              Role:
            </div>
            <select
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="operator"
              aria-label="Select role"
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Plant Manager</option>
            </select>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
          <nav className="space-y-1" aria-label="Primary">
            {navItems.map((n) => (
              <NavLink key={n.href} href={n.href} label={n.label} />
            ))}
          </nav>

          <div className="mt-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <p className="text-xs font-semibold text-amber-900">Tip</p>
            <p className="mt-1 text-xs text-amber-800">
              If pages show an API error, set{" "}
              <code className="rounded bg-white/70 px-1 py-0.5 text-[11px]">
                NEXT_PUBLIC_API_BASE_URL
              </code>{" "}
              to your backend URL.
            </p>
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>

      <footer className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-600">
          <p>
            API base URL is read from{" "}
            <code className="rounded bg-white px-1 py-0.5">
              NEXT_PUBLIC_API_BASE_URL
            </code>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
