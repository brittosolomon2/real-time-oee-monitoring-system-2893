"use client";

import React from "react";
import { ErrorState, LoadingState, EmptyState } from "@/components/States";
import { getRun, logDowntimeEvent, logQualityEvent, type ProductionRun } from "@/lib/api/oeeApi";

function isoNow(): string {
  return new Date().toISOString();
}

export default function EventsPage() {
  const [runId, setRunId] = React.useState("");
  const [run, setRun] = React.useState<ProductionRun | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [downtime, setDowntime] = React.useState({
    reason: "",
    started_at: isoNow(),
    ended_at: "",
  });

  const [quality, setQuality] = React.useState({
    good_count: "10",
    reject_count: "0",
    occurred_at: isoNow(),
  });

  async function loadRun() {
    if (!runId.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const r = await getRun(runId.trim());
      setRun(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch run.");
      setRun(null);
    } finally {
      setLoading(false);
    }
  }

  async function submitDowntime(e: React.FormEvent) {
    e.preventDefault();
    if (!run) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await logDowntimeEvent({
        run_id: run.id,
        reason: downtime.reason || undefined,
        started_at: downtime.started_at,
        ended_at: downtime.ended_at || undefined,
      });
      setSuccess("Downtime event created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create downtime event.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuality(e: React.FormEvent) {
    e.preventDefault();
    if (!run) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await logQualityEvent({
        run_id: run.id,
        good_count: Number(quality.good_count || "0"),
        reject_count: Number(quality.reject_count || "0"),
        occurred_at: quality.occurred_at,
      });
      setSuccess("Quality event created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quality event.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !run) return <LoadingState label="Loading run…" />;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header">
          <h1 className="text-base font-semibold text-slate-900">Event logging</h1>
          <p className="mt-1 text-sm text-slate-600">
            Log downtime and quality counts against a run.
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
              <button className="btn btn-secondary" type="button" onClick={loadRun}>
                Load run
              </button>
            </div>
          </div>

          {error ? <ErrorState description={error} onRetry={loadRun} /> : null}
          {success ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {success}
            </div>
          ) : null}

          {!run ? (
            <EmptyState
              title="No run loaded"
              description="Enter a run id and click Load run to enable event forms."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <form className="card" onSubmit={submitDowntime}>
                <div className="card-header">
                  <h2 className="text-sm font-semibold text-slate-900">Downtime event</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Requires <span className="font-mono">run_id</span> and{" "}
                    <span className="font-mono">started_at</span>.
                  </p>
                </div>
                <div className="card-body space-y-3">
                  <div>
                    <p className="label">Reason (optional)</p>
                    <input
                      className="input"
                      value={downtime.reason}
                      onChange={(e) => setDowntime((p) => ({ ...p, reason: e.target.value }))}
                      placeholder="e.g. jam, maintenance, changeover"
                    />
                  </div>

                  <div>
                    <p className="label">Started at (ISO)</p>
                    <input
                      className="input font-mono"
                      value={downtime.started_at}
                      onChange={(e) => setDowntime((p) => ({ ...p, started_at: e.target.value }))}
                    />
                  </div>

                  <div>
                    <p className="label">Ended at (ISO, optional)</p>
                    <input
                      className="input font-mono"
                      value={downtime.ended_at}
                      onChange={(e) => setDowntime((p) => ({ ...p, ended_at: e.target.value }))}
                      placeholder="leave blank for open downtime"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? "Submitting…" : "Create downtime event"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() =>
                        setDowntime((p) => ({
                          ...p,
                          started_at: isoNow(),
                          ended_at: "",
                        }))
                      }
                    >
                      Use now()
                    </button>
                  </div>
                </div>
              </form>

              <form className="card" onSubmit={submitQuality}>
                <div className="card-header">
                  <h2 className="text-sm font-semibold text-slate-900">Quality event</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Requires <span className="font-mono">run_id</span> and{" "}
                    <span className="font-mono">occurred_at</span>.
                  </p>
                </div>
                <div className="card-body space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="label">Good count</p>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={quality.good_count}
                        onChange={(e) =>
                          setQuality((p) => ({ ...p, good_count: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <p className="label">Reject count</p>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={quality.reject_count}
                        onChange={(e) =>
                          setQuality((p) => ({ ...p, reject_count: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="label">Occurred at (ISO)</p>
                    <input
                      className="input font-mono"
                      value={quality.occurred_at}
                      onChange={(e) =>
                        setQuality((p) => ({ ...p, occurred_at: e.target.value }))
                      }
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? "Submitting…" : "Create quality event"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setQuality((p) => ({ ...p, occurred_at: isoNow() }))}
                    >
                      Use now()
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
