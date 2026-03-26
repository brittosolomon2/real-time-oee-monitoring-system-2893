"use client";

import React from "react";
import { ErrorState, LoadingState, EmptyState } from "@/components/States";
import { listLines, listShifts, type Line, type Shift } from "@/lib/api/oeeApi";

export default function ReferencePage() {
  const [lines, setLines] = React.useState<Line[] | null>(null);
  const [shifts, setShifts] = React.useState<Shift[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [l, s] = await Promise.all([listLines(), listShifts()]);
      setLines(l);
      setShifts(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reference data.");
      setLines(null);
      setShifts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState label="Loading lines & shifts…" />;
  if (error) return <ErrorState description={error} onRetry={load} />;

  const hasLines = (lines?.length || 0) > 0;
  const hasShifts = (shifts?.length || 0) > 0;

  if (!hasLines && !hasShifts) {
    return (
      <EmptyState
        title="No reference data"
        description="The backend returned an empty list for both lines and shifts."
        actions={
          <button className="btn btn-secondary" type="button" onClick={load}>
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
          <h1 className="text-base font-semibold text-slate-900">Reference data</h1>
          <p className="mt-1 text-sm text-slate-600">
            Lines and shifts are used when creating production runs.
          </p>
        </div>
        <div className="card-body grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Lines</h2>
              <button className="btn btn-secondary" type="button" onClick={load}>
                Refresh
              </button>
            </div>

            {!hasLines ? (
              <div className="mt-3">
                <EmptyState title="No lines found" description="Seed data may not be applied yet." />
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {lines!.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">{l.name}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      <span className="font-mono">{l.id}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Shifts</h2>

            {!hasShifts ? (
              <div className="mt-3">
                <EmptyState title="No shifts found" description="Seed data may not be applied yet." />
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {shifts!.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {s.start_time} → {s.end_time} •{" "}
                          <span className="font-mono">{s.id}</span>
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                        shift
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
