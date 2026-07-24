export function Skeleton({ className = "", label = "Loading content" }) {
  return (
    <div
      className={["animate-pulse rounded-sm bg-surface", className].join(" ")}
      role="status"
      aria-label={label}
    />
  );
}
