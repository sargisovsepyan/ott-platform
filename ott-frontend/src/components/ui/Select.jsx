export function Select({ className = "", invalid = false, children, ...props }) {
  return (
    <select
      className={[
        "min-h-12 w-full rounded-md border bg-surface px-3.5 text-text",
        "transition-colors duration-[140ms] ease-out hover:border-border-strong focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/35",
        "disabled:cursor-not-allowed disabled:opacity-55",
        invalid ? "border-danger" : "border-border",
        className,
      ].join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}
