import React from "react";

type BoxProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

function StateBox({ title, description, actions }: BoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Standard loading state UI.
 */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <StateBox
      title={label}
      description="Please wait while we fetch the latest data from the OEE service."
      actions={
        <div
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
        />
      }
    />
  );
}

/**
 * PUBLIC_INTERFACE
 * Standard empty state UI.
 */
export function EmptyState({
  title = "Nothing to show yet",
  description = "Try creating a production run or adjust your filters.",
  actions,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return <StateBox title={title} description={description} actions={actions} />;
}

/**
 * PUBLIC_INTERFACE
 * Standard error state UI.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <StateBox
      title={title}
      description={description || "An unexpected error occurred while talking to the backend API."}
      actions={
        onRetry ? (
          <button className="btn btn-secondary" onClick={onRetry} type="button">
            Retry
          </button>
        ) : null
      }
    />
  );
}
