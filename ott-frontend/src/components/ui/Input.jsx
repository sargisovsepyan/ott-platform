export function Input({ className = "", invalid = false, ...props }) {
  return (
    <input
      className={[
        "min-h-12 w-full rounded-md border bg-background-elevated/80 px-3.5 text-text placeholder:text-text-subtle",
        "transition-[background-color,border-color,box-shadow] duration-[180ms] ease-out hover:border-border-strong hover:bg-surface focus:border-focus focus:bg-surface focus:outline-none focus:ring-2 focus:ring-focus/25",
        "disabled:cursor-not-allowed disabled:opacity-55",
        invalid ? "border-danger" : "border-border",
        className,
      ].join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
