"use client";

import React from "react";
import { getApiBaseUrl } from "@/lib/api/client";

export default function SettingsPage() {
  const [baseUrl, setBaseUrl] = React.useState<string>("");

  React.useEffect(() => {
    setBaseUrl(getApiBaseUrl());
  }, []);

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header">
          <h1 className="text-base font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure how this UI connects to the backend API.
          </p>
        </div>
        <div className="card-body space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Backend base URL</p>
            <p className="mt-1 text-sm text-slate-600">
              Set{" "}
              <code className="rounded bg-slate-50 px-1 py-0.5 text-xs ring-1 ring-slate-200">
                NEXT_PUBLIC_API_BASE_URL
              </code>{" "}
              to the backend server origin (no trailing slash).
            </p>

            <div className="mt-3">
              <p className="label">Current value</p>
              <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900">
                {baseUrl}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <p className="text-xs font-semibold text-amber-900">Example</p>
              <p className="mt-1 text-xs text-amber-900">
                <code className="rounded bg-white/70 px-1 py-0.5">
                  NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
                </code>
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Then reload the page. The app uses this value for all REST calls.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-slate-900">Troubleshooting</h2>
            </div>
            <div className="card-body">
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                <li>
                  If you see CORS errors, ensure the backend is configured to allow this frontend
                  origin (the provided backend uses permissive CORS by default).
                </li>
                <li>
                  If you see 404s, confirm the backend routes are mounted at{" "}
                  <span className="font-mono">/api/*</span>.
                </li>
                <li>
                  If your backend runs on a different port locally, update{" "}
                  <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span> accordingly.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
