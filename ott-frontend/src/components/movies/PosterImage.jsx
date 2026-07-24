import { useState } from "react";
import { Film } from "lucide-react";

export function PosterImage({
  src,
  title,
  className = "",
  loading = "lazy",
  sizes,
}) {
  const [failedSource, setFailedSource] = useState("");
  const fallbackLabel = title ? `No poster available for ${title}` : "No poster available";
  const showFallback = !src || failedSource === src;

  return (
    <div
      className={[
        "relative aspect-[2/3] overflow-hidden rounded-sm border border-border bg-surface",
        className,
      ].join(" ")}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={`Poster for ${title}`}
          loading={loading}
          sizes={sizes}
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedSource(src)}
        />
      ) : null}
      {showFallback ? (
        <div
          className="absolute inset-0 grid place-items-center px-3 text-center text-text-subtle"
          role="img"
          aria-label={fallbackLabel}
        >
          <div>
            <Film className="mx-auto size-8" aria-hidden="true" />
            <span className="mt-3 block text-xs font-medium">{title}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
