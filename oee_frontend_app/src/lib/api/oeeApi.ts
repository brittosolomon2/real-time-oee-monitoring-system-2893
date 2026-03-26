import { apiGet, apiPost, type ApiEnvelope } from "./client";

export type Line = { id: string; name: string; created_at: string };
export type Shift = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

export type ProductionRun = {
  id: string;
  line_id: string;
  shift_id: string | null;
  product_code: string | null;
  started_at: string;
  ended_at: string | null;
  planned_production_seconds: number;
  ideal_cycle_time_seconds: number;
  created_at: string;
};

export type OeeBreakdown = {
  run_id: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  inputs: Record<string, unknown>;
  computed_at: string;
};

export type CreateRunInput = {
  id?: string;
  line_id: string;
  shift_id?: string;
  product_code?: string;
  started_at: string;
  ended_at?: string;
  planned_production_seconds?: number;
  ideal_cycle_time_seconds?: number;
};

export type EndRunInput = { ended_at: string };

export type CreateDowntimeEventInput = {
  run_id: string;
  reason?: string;
  started_at: string;
  ended_at?: string;
};

export type CreateQualityEventInput = {
  run_id: string;
  good_count?: number;
  reject_count?: number;
  occurred_at: string;
};

/**
 * PUBLIC_INTERFACE
 * Lists production lines.
 */
export async function listLines(): Promise<Line[]> {
  const res = await apiGet<ApiEnvelope<Line[]>>("/api/lines");
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Lists shifts.
 */
export async function listShifts(): Promise<Shift[]> {
  const res = await apiGet<ApiEnvelope<Shift[]>>("/api/shifts");
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Creates a production run.
 */
export async function createRun(input: CreateRunInput): Promise<ProductionRun> {
  const res = await apiPost<ApiEnvelope<ProductionRun>, CreateRunInput>(
    "/api/runs",
    input
  );
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Gets a production run by id.
 */
export async function getRun(runId: string): Promise<ProductionRun> {
  const res = await apiGet<ApiEnvelope<ProductionRun>>(`/api/runs/${runId}`);
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Ends a production run.
 */
export async function endRun(runId: string, input: EndRunInput): Promise<ProductionRun> {
  const res = await apiPost<ApiEnvelope<ProductionRun>, EndRunInput>(
    `/api/runs/${runId}/end`,
    input
  );
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Logs a downtime event for a run.
 */
export async function logDowntimeEvent(
  input: CreateDowntimeEventInput
): Promise<Record<string, unknown>> {
  const res = await apiPost<ApiEnvelope<Record<string, unknown>>, CreateDowntimeEventInput>(
    "/api/events/downtime",
    input
  );
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Logs a quality event for a run.
 */
export async function logQualityEvent(
  input: CreateQualityEventInput
): Promise<Record<string, unknown>> {
  const res = await apiPost<ApiEnvelope<Record<string, unknown>>, CreateQualityEventInput>(
    "/api/events/quality",
    input
  );
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * Fetches calculated OEE breakdown for a run.
 */
export async function getOeeForRun(runId: string): Promise<OeeBreakdown> {
  const res = await apiGet<ApiEnvelope<OeeBreakdown>>(`/api/oee/runs/${runId}`);
  return res.data;
}
