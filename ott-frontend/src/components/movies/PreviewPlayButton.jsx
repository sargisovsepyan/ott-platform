import { Play } from "lucide-react";
import { useMoviePreview } from "../../hooks/useMoviePreview";
import { getPreviewVideoUrl } from "../../utils/previewVideo";
import { Button } from "../ui/Button";

export function PreviewPlayButton({
  movie,
  placement = "default",
  variant = "secondary",
  className = "",
}) {
  const { openPreview } = useMoviePreview();
  const previewVideoUrl = getPreviewVideoUrl(movie?.previewVideoUrl);

  if (!previewVideoUrl) {
    return null;
  }

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPreview({ ...movie, previewVideoUrl }, event.currentTarget);
  };

  if (placement === "card") {
    return (
      <button
        type="button"
        className={[
          "absolute inset-x-3 bottom-3 z-20 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary/70 bg-background/92 px-3 py-2 text-sm font-semibold text-text shadow-panel",
          "transition-[opacity,background-color,border-color,transform] duration-[180ms] ease-out hover:border-primary-hover hover:bg-primary active:translate-y-px",
          "md:pointer-events-none md:bottom-1/2 md:left-1/2 md:right-auto md:w-max md:-translate-x-1/2 md:translate-y-1/2 md:opacity-0",
          "md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100",
          "focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={`Play preview for ${movie.title}`}
        onClick={handleClick}
      >
        <Play className="size-4 fill-current" aria-hidden="true" />
        Play preview
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      aria-label={`Play preview for ${movie.title}`}
      onClick={handleClick}
    >
      <Play className="size-4 fill-current" aria-hidden="true" />
      Play preview
    </Button>
  );
}
