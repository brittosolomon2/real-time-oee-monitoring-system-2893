"use client";

import React from "react";
import {
  createRun,
  endRun,
  getRun,
  listLines,
  listShifts,
  type Line,
  type Shift,
  type ProductionRun,
} from "@/lib/api/oeeApi";
import { ErrorState, LoadingState, EmptyState } from "@/components/States";

function isoNowLocal(): string {
  return new Date().toISOString();
}

export default function RunsPage() {
  const [lines, setLines] = React.useState<Line[] | null>(null);
  const [shifts, setShifts] = React.useState<Shift[] | null>(null);

  const [loadingRef, setLoadingRef] = React.useState(true);
  const [refError, setRefError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    line_id: "",
    shift_id: "",
    product_code: "",
    started_at: isoNowLocal(),
    planned_production_seconds: "28800",
    ideal_cycle_time_seconds: "1.2",
  });

  const [resultRun, setResultRun] = React.useState<ProductionRun | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const [lookupId, setLookupId] = React.useState("");
  const [lookupLoading, setLookupLoading] = React.useState(false);

  const loadReference = React.useCallback(async () => {
    setLoadingRef(true);
    setRefError(null);
    try {
      const [l, s] = await Promise.all([listLines(), listShifts()]);
      setLines(l);
      setShifts(s);
      if (!form.line_id && l.length > 0) {
        setForm((prev) => ({ ...prev, line_id: l[0].id }));
      }
    } catch (e) {
      setRefError(e instanceof Error ? e.message : "Failed to load reference data.");
      setLines(null);
      setShifts(null);
    } finally {
      setLoadingRef(false);
    }
  }, [form.line_id]);

  React.useEffect(() => {
    void loadReference();
  }, [loadReference]);

  async function onCreateRun(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);
    try {
      const run = await createRun({
        line_id: form.line_id,
        shift_id: form.shift_id || undefined,
        product_code: form.product_code || undefined,
        started_at: form.started_at,
        planned_production_seconds: Number(form.planned_production_seconds || "0"),
        ideal_cycle_time_seconds: Number(form.ideal_cycle_time_seconds || "0"),
      });
      setResultRun(run);
      setLookupId(run.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create run.");
    } finally {
      setActionLoading(false);
    }
  }

  async function onLookupRun() {
    if (!lookupId.trim()) return;
    setActionError(null);
    setLookupLoading(true);
    try {
      const run = await getRun(lookupId.trim());
      setResultRun(run);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to fetch run.");
      setResultRun(null);
    } finally {
      setLookupLoading(false);
    }
  }

  async function onEndRun() {
    if (!resultRun) return;
    setActionError(null);
    setActionLoading(true);
    try {
      const ended = await endRun(resultRun.id, { ended_at: isoNowLocal() });
      setResultRun(ended);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to end run.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loadingRef) return <LoadingState label="Loading run tools…" />;
  if (refError) return <ErrorState description={refError} onRetry={loadReference} />;

  const hasLines = (lines?.length || 0) > 0;
  if (!hasLines) {
    return (
      <EmptyState
        title="No lines available"
        description="You need at least one line to create a production run. Check backend seed data."
        actions={
          <button className="btn btn-secondary" type="button" onClick={loadReference}>
            Refresh
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header">
          <h1 className="text-base font-semibold text-slate-900">Production runs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a run, look it up by ID, and end it when production stops.
          </p>
        </div>

        <div className="card-body grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form className="space-y-4" onSubmit={onCreateRun}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Line</p>
                <select
                  className="input"
                  value={form.line_id}
                  onChange={(e) => setForm((p) => ({ ...p, line_id: e.target.value }))}
                >
                  {lines!.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="label">Shift (optional)</p>
                <select
                  className="input"
                  value={form.shift_id}
                  onChange={(e) => setForm((p) => ({ ...p, shift_id: e.target.value }))}
                >
                  <option value="">—</option>
                  {(shifts || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.start_time}–{s.end_time})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="label">Product code (optional)</p>
              <input
                className="input"
                value={form.product_code}
                onChange={(e) => setForm((p) => ({ ...p, product_code: e.target.value }))}
                placeholder="e.g. SKU-1234"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Started at (ISO)</p>
                <input
                  className="input font-mono"
                  value={form.started_at}
                  onChange={(e) => setForm((p) => ({ ...p, started_at: e.target.value }))}
                />
              </div>

              <div>
                <p className="label">Planned production seconds</p>
                <input
                  className="input"
                  inputMode="numeric"
                  value={form.planned_production_seconds}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, planned_production_seconds: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Ideal cycle time (seconds)</p>
                <input
                  className="input"
                  inputMode="decimal"
                  value={form.ideal_cycle_time_seconds}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, ideal_cycle_time_seconds: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-end">
                <button className="btn btn-primary w-full" disabled={actionLoading} type="submit">
                  {actionLoading ? "Creating…" : "Create run"}
                </button>
              </div>
            </div>

            {actionError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {actionError}
              </div>
            ) : null}
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Lookup run</p>
              <p className="mt-1 text-sm text-slate-600">
                Paste a run id to fetch the latest run record.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className="input font-mono"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="run_..."
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={onLookupRun}
                  disabled={lookupLoading}
                >
                  {lookupLoading ? "Fetching…" : "Fetch"}
                </button>
              </div>
            </div>

            {!resultRun ? (
              <EmptyState
                title="No run selected"
                description="Create a run or fetch one by ID to see details."
              />
            ) : (
              <div className="card">
                <div className="card-header flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Run details</h2>
                    <p className="mt-1 text-xs text-slate-600 font-mono">{resultRun.id}</p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-2 py-1 text-xs font-semibold ring-1",
                      resultRun.ended_at
                        ? "bg-slate-50 text-slate-700 ring-slate-200"
                        : "bg-blue-50 text-blue-700 ring-blue-100",
                    ].join(" ")}
                  >
                    {resultRun.ended_at ? "ended" : "active"}
                  </span>
                </div>
                <div className="card-body space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Line:</span>{" "}
                    <span className="font-mono">{resultRun.line_id}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Shift:</span>{" "}
                    <span className="font-mono">{resultRun.shift_id || "—"}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Started:</span>{" "}
                    <span className="font-mono">{resultRun.started_at}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Ended:</span>{" "}
                    <span className="font-mono">{resultRun.ended_at || "—"}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Planned seconds:</span>{" "}
                    {resultRun.planned_production_seconds}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Ideal cycle seconds:</span>{" "}
                    {resultRun.ideal_cycle_time_seconds}
                  </p>

                  <div className="pt-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={onEndRun}
                      disabled={actionLoading || Boolean(resultRun.ended_at)}
                    >
                      End run now
                    </button>
                    <p className="mt-2 text-xs text-slate-600">
                      Ending sets <span className="font-mono">ended_at</span> to current time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
