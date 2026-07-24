export function Skeleton({ className = "", label = "Loading content" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md border border-border/35 bg-surface-raised/85",
        className,
      ].join(" ")}
      role="status"
      aria-label={label}
    />
  );
}
