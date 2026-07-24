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
        "panel-surface grid min-h-72 place-items-center rounded-lg px-6 py-14 text-center",
        className,
      ].join(" ")}
      role="alert"
    >
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-danger/35 bg-danger/10 text-danger">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
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
