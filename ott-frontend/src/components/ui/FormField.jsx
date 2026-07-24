export function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className = "",
}) {
  const descriptionId = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={["grid gap-2", className].join(" ")}>
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({ describedBy: descriptionId || undefined, invalid: Boolean(error) })}
      {hint ? (
        <p id={`${id}-hint`} className="m-0 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="m-0 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
