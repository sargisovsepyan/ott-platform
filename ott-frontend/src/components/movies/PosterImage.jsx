import { useState } from "react";
import { Clapperboard } from "lucide-react";

function getInitials(title) {
  const words = title?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!words.length) {
    return "L";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getVersionedSource(src, version) {
  if (
    !src ||
    !version ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}lumioVersion=${encodeURIComponent(version)}`;
}

export function PosterImage({
  src,
  version,
  title,
  year,
  className = "",
  imageClassName = "",
  loading = "lazy",
  sizes,
  decorative = false,
}) {
  const [failedSource, setFailedSource] = useState("");
  const imageSource = getVersionedSource(src, version);
  const fallbackLabel = title ? `No poster available for ${title}` : "No poster available";
  const showFallback = !imageSource || failedSource === imageSource;

  return (
    <div
      className={[
        "relative aspect-[2/3] overflow-hidden rounded-sm border border-border bg-surface",
        className,
      ].join(" ")}
    >
      {!showFallback ? (
        <img
          src={imageSource}
          alt={decorative ? "" : `Poster for ${title}`}
          loading={loading}
          sizes={sizes}
          className={[
            "absolute inset-0 size-full object-cover",
            imageClassName,
          ].join(" ")}
          onError={() => setFailedSource(imageSource)}
        />
      ) : null}
      {showFallback ? (
        <div
          className="poster-fallback absolute inset-0 grid place-items-center px-4 text-center"
          role={decorative ? undefined : "img"}
          aria-hidden={decorative || undefined}
          aria-label={decorative ? undefined : fallbackLabel}
        >
          <div className="relative z-10">
            <Clapperboard
              className="mx-auto size-6 text-primary-hover/85"
              aria-hidden="true"
            />
            <span className="mt-4 block text-4xl font-bold tracking-[-0.04em] text-text/90">
              {getInitials(title)}
            </span>
            <span className="mx-auto mt-4 block max-w-36 text-xs font-semibold leading-snug text-text-muted">
              {title || "Lumio"}
            </span>
            {year ? (
              <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-subtle">
                {year}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
