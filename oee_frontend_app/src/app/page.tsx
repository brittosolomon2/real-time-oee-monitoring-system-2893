import Link from "next/link";

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <p className="text-xs font-semibold text-slate-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-600">{hint}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="card-body">
          <p className="text-xs font-semibold text-blue-700">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Real-time OEE Monitoring
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Start a production run, log downtime and quality events, and view live
            OEE breakdowns. Configure the backend URL in Settings if needed.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/runs" className="btn btn-primary">
              Create / Manage Runs
            </Link>
            <Link href="/events" className="btn btn-secondary">
              Log Events
            </Link>
            <Link href="/oee" className="btn btn-secondary">
              View OEE
            </Link>
            <Link href="/reference" className="btn btn-secondary">
              Lines & Shifts
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Availability"
          value="—"
          hint="Calculated from operating vs planned time."
        />
        <StatCard
          title="Performance"
          value="—"
          hint="Ideal cycle time vs actual throughput."
        />
        <StatCard
          title="Quality"
          value="—"
          hint="Good parts over total parts."
        />
      </section>

      <section className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-900">
            Getting started checklist
          </h2>
        </div>
        <div className="card-body">
          <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-2">
            <li>
              Go to <Link className="text-blue-700 underline" href="/reference">Reference</Link>{" "}
              to confirm lines and shifts are loading.
            </li>
            <li>
              Go to <Link className="text-blue-700 underline" href="/runs">Runs</Link>{" "}
              to create a new run (requires line_id + started_at).
            </li>
            <li>
              Go to <Link className="text-blue-700 underline" href="/events">Events</Link>{" "}
              to log downtime and quality counts against the run.
            </li>
            <li>
              Go to <Link className="text-blue-700 underline" href="/oee">OEE</Link>{" "}
              to fetch the OEE breakdown for the run.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
