import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}) {
  return (
    <section
      className={[
        "grid min-h-64 place-items-center rounded-md border border-border bg-surface px-6 py-12 text-center",
        className,
      ].join(" ")}
      role="alert"
    >
      <div className="max-w-md">
        <AlertTriangle className="mx-auto size-9 text-danger" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-text">{title}</h2>
        <p className="mt-2 text-text-muted">{message}</p>
        {onRetry ? (
          <Button className="mt-6" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </section>
  );
}
