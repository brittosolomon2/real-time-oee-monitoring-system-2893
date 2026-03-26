"use client";

import React from "react";
import { ErrorState, LoadingState, EmptyState } from "@/components/States";
import { getOeeForRun, type OeeBreakdown } from "@/lib/api/oeeApi";

function pct(x: number): string {
  if (!Number.isFinite(x)) return "0%";
  return `${Math.round(x * 100)}%`;
}

function Meter({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{pct(v)}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${v * 100}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function OeePage() {
  const [runId, setRunId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<OeeBreakdown | null>(null);

  async function fetchOee() {
    if (!runId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getOeeForRun(runId.trim());
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load OEE.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header">
          <h1 className="text-base font-semibold text-slate-900">OEE breakdown</h1>
          <p className="mt-1 text-sm text-slate-600">
            Fetches calculated OEE for a run. If the run has not ended, the backend uses live now().
          </p>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="label">Run ID</p>
              <input
                className="input font-mono"
                value={runId}
                onChange={(e) => setRunId(e.target.value)}
                placeholder="run_..."
              />
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary" type="button" onClick={fetchOee} disabled={loading}>
                {loading ? "Fetching…" : "Fetch OEE"}
              </button>
            </div>
          </div>

          {loading ? <LoadingState label="Calculating OEE…" /> : null}
          {error ? <ErrorState description={error} onRetry={fetchOee} /> : null}

          {!loading && !error && !data ? (
            <EmptyState
              title="No OEE data yet"
              description="Enter a run id and fetch OEE to see availability, performance, and quality."
            />
          ) : null}

          {data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card">
                  <div className="card-body">
                    <p className="text-xs font-semibold text-slate-600">OEE</p>
                    <p className="mt-2 text-4xl font-semibold text-slate-900">{pct(data.oee)}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Computed at <span className="font-mono">{data.computed_at}</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Meter label="Availability" value={data.availability} />
                  <Meter label="Performance" value={data.performance} />
                  <Meter label="Quality" value={data.quality} />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="text-sm font-semibold text-slate-900">Inputs</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Values the backend used to compute OEE.
                  </p>
                </div>
                <div className="card-body">
                  <pre className="overflow-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-800 ring-1 ring-slate-200">
{JSON.stringify(data.inputs, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
