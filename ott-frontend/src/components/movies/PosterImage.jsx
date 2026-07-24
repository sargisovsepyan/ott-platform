import { Film } from "lucide-react";

export function PosterImage({
  src,
  title,
  className = "",
  loading = "lazy",
  sizes,
}) {
  const fallbackLabel = title ? `No poster available for ${title}` : "No poster available";

  return (
    <div
      className={[
        "relative aspect-[2/3] overflow-hidden rounded-sm border border-border bg-surface",
        className,
      ].join(" ")}
    >
      {src ? (
        <img
          src={src}
          alt={`Poster for ${title}`}
          loading={loading}
          sizes={sizes}
          className="absolute inset-0 size-full object-cover"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling?.removeAttribute("hidden");
          }}
        />
      ) : null}
      <div
        hidden={Boolean(src)}
        className="absolute inset-0 grid place-items-center px-3 text-center text-text-subtle"
        role="img"
        aria-label={fallbackLabel}
      >
        <div>
          <Film className="mx-auto size-8" aria-hidden="true" />
          <span className="mt-3 block text-xs font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
}
