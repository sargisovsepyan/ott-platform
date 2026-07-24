import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

const styles = {
  error: {
    icon: AlertCircle,
    border: "border-l-danger",
    title: "Error",
  },
  success: {
    icon: CheckCircle2,
    border: "border-l-success",
    title: "Success",
  },
  warning: {
    icon: TriangleAlert,
    border: "border-l-warning",
    title: "Attention",
  },
  info: {
    icon: Info,
    border: "border-l-primary",
    title: "Information",
  },
};

export function Alert({ tone = "info", title, children, className = "" }) {
  const config = styles[tone] ?? styles.info;
  const Icon = config.icon;

  return (
    <div
      className={[
        "rounded-md border border-border/90 border-l-4 bg-surface-raised/80 px-4 py-3.5 shadow-card",
        config.border,
        className,
      ].join(" ")}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="m-0 font-semibold text-text">{title ?? config.title}</p>
          <div className="mt-1 text-sm text-text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}
