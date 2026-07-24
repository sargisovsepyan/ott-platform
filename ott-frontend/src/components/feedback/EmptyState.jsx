import { Film } from "lucide-react";

export function EmptyState({ title, message, action, className = "" }) {
  return (
    <section
      className={[
        "panel-surface grid min-h-72 place-items-center rounded-lg px-6 py-14 text-center",
        className,
      ].join(" ")}
    >
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-primary-soft/60 text-primary-hover">
          <Film className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-2xl font-semibold text-text">{title}</h2>
        <p className="mt-2 text-text-muted">{message}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </section>
  );
}
