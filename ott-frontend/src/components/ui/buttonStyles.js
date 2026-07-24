const variants = {
  primary:
    "border-primary bg-primary text-text hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active",
  secondary:
    "border-border-strong bg-transparent text-text hover:bg-surface-hover active:bg-surface-raised",
  ghost:
    "border-transparent bg-transparent text-text-muted hover:bg-surface-hover hover:text-text active:bg-surface-raised",
  danger:
    "border-danger bg-transparent text-danger hover:bg-danger hover:text-text active:bg-danger/80",
  link: "h-auto border-transparent bg-transparent px-0 text-primary-hover underline-offset-4 hover:underline",
};

export function buttonClassName(variant = "primary", className = "") {
  return [
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold",
    "transition-colors duration-[140ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant] ?? variants.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
