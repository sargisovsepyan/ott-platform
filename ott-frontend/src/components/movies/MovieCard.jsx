import { Link, useLocation } from "react-router";
import { createMovieDetailState } from "../../utils/movieNavigation";
import { getPreviewVideoUrl } from "../../utils/previewVideo";
import { MovieMetadata } from "./MovieMetadata";
import { PosterImage } from "./PosterImage";
import { PreviewPlayButton } from "./PreviewPlayButton";

export function MovieCard({ movie, className = "" }) {
  const location = useLocation();
  const detailState = createMovieDetailState(location);
  const hasPreview = Boolean(getPreviewVideoUrl(movie.previewVideoUrl));

  return (
    <article
      className={[
        "group relative min-w-0 rounded-lg border border-border/75 bg-surface/65 shadow-card",
        "transition-[background-color,border-color,box-shadow,transform] duration-[220ms] ease-out hover:-translate-y-1 hover:border-border-strong hover:bg-surface-raised/80 hover:shadow-panel",
        className,
      ].join(" ")}
    >
      <div className="p-2 pb-3">
        <div className="relative">
          <PosterImage
            src={movie.poster}
            version={movie.updatedAt}
            title={movie.title}
            year={movie.year}
            sizes="(min-width: 1536px) 190px, (min-width: 1280px) 18vw, (min-width: 768px) 25vw, 46vw"
            className="rounded-md border-border/80 transition-colors duration-[140ms] ease-out group-hover:border-primary/45"
            imageClassName="motion-zoom transition-transform duration-[480ms] ease-out group-hover:scale-[1.035]"
          />
          {hasPreview ? (
            <span
              className="pointer-events-none absolute inset-0 rounded-md bg-black/35 transition-colors duration-[140ms] ease-out md:bg-transparent md:group-hover:bg-black/58 md:group-focus-within:bg-black/58"
              aria-hidden="true"
            />
          ) : null}
          <PreviewPlayButton movie={movie} placement="card" />
        </div>
        <div className="px-1.5 pb-0.5 pt-3">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-text sm:text-[1.05rem]">
            {movie.title}
          </h2>
          <div className="mt-2.5">
            <MovieMetadata movie={movie} compact />
          </div>
        </div>
      </div>
      <Link
        to={`/movies/${movie.id}`}
        state={detailState}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label={`View details for ${movie.title}`}
        onKeyDown={(event) => {
          if (
            (event.key === " " || event.key === "Enter") &&
            !event.repeat
          ) {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
      />
    </article>
  );
}
