import { Badge } from "../ui/Badge";

export function MovieMetadata({ movie, compact = false }) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-text-muted",
        compact ? "text-xs" : "text-sm",
      ].join(" ")}
      aria-label="Movie metadata"
    >
      {movie.year ? <span>{movie.year}</span> : null}
      {movie.year && movie.genre ? <span aria-hidden="true">•</span> : null}
      {movie.genre ? <span>{movie.genre}</span> : null}
      <Badge
        className={compact ? "ml-auto" : ""}
        aria-label={`Rating ${movie.rating} out of 10`}
      >
        {movie.rating.toFixed(1)} / 10
      </Badge>
    </div>
  );
}
