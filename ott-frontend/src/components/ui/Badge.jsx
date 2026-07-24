export function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "border-border bg-surface text-text-muted",
    primary: "border-primary bg-primary-soft text-text",
    success: "border-success/60 bg-success/10 text-success",
    warning: "border-warning/60 bg-warning/10 text-warning",
    danger: "border-danger/60 bg-danger/10 text-danger",
  };

  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-xs border px-2 py-0.5 text-xs font-semibold",
        tones[tone] ?? tones.neutral,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
