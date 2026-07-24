export function Textarea({ className = "", invalid = false, ...props }) {
  return (
    <textarea
      className={[
        "min-h-32 w-full resize-y rounded-md border bg-surface px-3.5 py-3 text-text placeholder:text-text-subtle",
        "transition-colors duration-[140ms] ease-out hover:border-border-strong focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/35",
        "disabled:cursor-not-allowed disabled:opacity-55",
        invalid ? "border-danger" : "border-border",
        className,
      ].join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
