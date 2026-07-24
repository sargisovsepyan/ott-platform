import { LoaderCircle } from "lucide-react";

export function Spinner({ label = "Loading", className = "" }) {
  return (
    <div
      className={["inline-flex items-center gap-2 text-text-muted", className].join(" ")}
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
