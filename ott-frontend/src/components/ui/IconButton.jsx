export function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-transparent text-text-muted",
        "transition-[color,background-color,border-color,transform] duration-[180ms] ease-out hover:border-border hover:bg-surface-hover hover:text-text",
        "active:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-55",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
