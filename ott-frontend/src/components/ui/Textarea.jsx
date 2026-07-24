export function Textarea({ className = "", invalid = false, ...props }) {
  return (
    <textarea
      className={[
        "min-h-36 w-full resize-y rounded-md border bg-background-elevated/80 px-3.5 py-3 text-text placeholder:text-text-subtle",
        "transition-[background-color,border-color,box-shadow] duration-[140ms] ease-out hover:border-border-strong hover:bg-surface focus:border-focus focus:bg-surface focus:outline-none focus:ring-2 focus:ring-focus/25",
        "disabled:cursor-not-allowed disabled:opacity-55",
        invalid ? "border-danger" : "border-border",
        className,
      ].join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
