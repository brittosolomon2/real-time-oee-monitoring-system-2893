"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faChartLine,
  faShieldHalved,
  faPeopleGroup,
  faGaugeHigh,
  faClipboardCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-100">
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

export default function LandingPage() {
  const reduced = useReducedMotion();

  const heroVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 shadow-sm">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="show"
            >
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                <FontAwesomeIcon icon={faBolt} className="h-3.5 w-3.5" />
                Real-time visibility for manufacturing performance
              </p>

              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Professional OEE monitoring that operators actually use
              </h1>

              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-slate-600">
                Capture downtime and quality events in seconds, calculate live OEE
                automatically, and give supervisors the clarity they need to
                respond fast—without spreadsheets.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/auth"
                  className="btn btn-primary"
                  aria-label="Go to login and sign up"
                >
                  Get started
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </Link>
                <Link href="/reference" className="btn btn-secondary">
                  Explore reference data
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Metric
                  label="Operators"
                  value="Fast logging"
                  hint="Two-click downtime & quality entry."
                />
                <Metric
                  label="Supervisors"
                  value="Live OEE"
                  hint="Availability, performance, quality."
                />
                <Metric
                  label="Managers"
                  value="Traceable"
                  hint="Auditable shift reporting path."
                />
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <motion.div
                variants={heroVariants}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      OEE snapshot
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      A clean view tailored for the shop floor.
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 ring-1 ring-amber-100">
                    Live
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  {[
                    { label: "Availability", value: 0.82 },
                    { label: "Performance", value: 0.88 },
                    { label: "Quality", value: 0.97 },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          {m.label}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {Math.round(m.value * 100)}%
                        </p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value * 100}%` }}
                          transition={{
                            duration: reduced ? 0 : 0.9,
                            ease: "easeOut",
                          }}
                          className="h-2 rounded-full bg-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold text-slate-700">
                      Downtime capture
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Standardize reasons and improve root-cause analysis.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold text-slate-700">
                      Quality counts
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Track good vs reject in real time per run.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700">Why this works</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Built for the rhythm of a production line
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The system is designed around simple, repeatable workflows:
                start runs, log events, and monitor OEE. Permissions ensure the
                right actions are available to the right roles.
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/auth" className="btn btn-primary">
                Sign in
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
              </Link>
              <Link href="/settings" className="btn btn-secondary">
                Connection settings
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={faGaugeHigh}
              title="Operator-first UI"
              description="Minimal friction event logging with clear inputs and immediate feedback."
            />
            <FeatureCard
              icon={faChartLine}
              title="Real-time OEE breakdowns"
              description="Availability, performance, and quality computed consistently from logged events."
            />
            <FeatureCard
              icon={faClipboardCheck}
              title="Shift-ready accountability"
              description="A reliable record of what happened across the shift, tied to runs and timestamps."
            />
            <FeatureCard
              icon={faPeopleGroup}
              title="Role-based access"
              description="Operators log. Supervisors review. Managers configure and manage users."
            />
            <FeatureCard
              icon={faShieldHalved}
              title="JWT security"
              description="Protected endpoints require a token; the frontend attaches it automatically."
            />
            <FeatureCard
              icon={faBolt}
              title="Fast to deploy"
              description="Set your backend URL once, and the frontend is ready for plant or demo environments."
            />
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Ready to monitor performance in real time?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in to start a run, log downtime, and see OEE live.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/auth" className="btn btn-primary">
                  Continue to login
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </Link>
                <Link href="/reference" className="btn btn-secondary">
                  View demo data
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
