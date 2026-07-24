const variants = {
  primary:
    "border-primary bg-primary text-text shadow-glow hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active",
  secondary:
    "border-border-strong bg-surface/55 text-text backdrop-blur-sm hover:border-primary/60 hover:bg-surface-hover active:bg-surface-raised",
  ghost:
    "border-transparent bg-transparent text-text-muted hover:bg-surface-hover hover:text-text active:bg-surface-raised",
  danger:
    "border-danger/70 bg-danger/10 text-danger hover:bg-danger hover:text-text active:bg-danger/80",
  link: "h-auto border-transparent bg-transparent px-0 text-primary-hover underline-offset-4 hover:underline",
};

export function buttonClassName(variant = "primary", className = "") {
  return [
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-[180ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant] ?? variants.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
