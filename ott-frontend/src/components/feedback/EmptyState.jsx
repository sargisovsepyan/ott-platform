import { Film } from "lucide-react";

export function EmptyState({ title, message, action, className = "" }) {
  return (
    <section
      className={[
        "grid min-h-64 place-items-center rounded-md border border-border bg-surface px-6 py-12 text-center",
        className,
      ].join(" ")}
    >
      <div className="max-w-md">
        <Film className="mx-auto size-9 text-text-subtle" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-text">{title}</h2>
        <p className="mt-2 text-text-muted">{message}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </section>
  );
}
