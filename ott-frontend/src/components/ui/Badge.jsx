export function Badge({ children, tone = "neutral", className = "", ...props }) {
  const tones = {
    neutral: "border-border bg-background-elevated/85 text-text-muted",
    primary: "border-primary/70 bg-primary-soft text-text",
    success: "border-success/60 bg-success/10 text-success",
    warning: "border-warning/60 bg-warning/10 text-warning",
    danger: "border-danger/60 bg-danger/10 text-danger",
  };

  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        tones[tone] ?? tones.neutral,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
