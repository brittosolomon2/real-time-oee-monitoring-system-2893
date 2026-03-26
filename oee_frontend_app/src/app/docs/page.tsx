"use client";

import React from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/api/client";

export default function DocsPage() {
  const [baseUrl, setBaseUrl] = React.useState("");

  React.useEffect(() => {
    setBaseUrl(getApiBaseUrl());
  }, []);

  const docsUrl = `${baseUrl.replace(/\/+$/, "")}/docs`;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header">
          <h1 className="text-base font-semibold text-slate-900">Backend API docs</h1>
          <p className="mt-1 text-sm text-slate-600">
            The Express backend serves Swagger UI at <span className="font-mono">/docs</span>.
          </p>
        </div>
        <div className="card-body space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Detected backend base URL</p>
            <p className="mt-1 text-sm text-slate-600">
              Configured via <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span>.
            </p>

            <div className="mt-3">
              <p className="label">Docs link</p>
              <a
                className="mt-1 block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 underline"
                href={docsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {docsUrl}
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/auth" className="btn btn-primary">
                Go to auth
              </Link>
              <Link href="/settings" className="btn btn-secondary">
                Settings
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Protected endpoints require a JWT. After signing in on the Auth page, the
            frontend attaches <span className="font-mono">Authorization: Bearer</span> automatically.
          </div>
        </div>
      </section>
    </div>
  );
}
