import { Link } from "react-router";
import { MovieMetadata } from "./MovieMetadata";
import { PosterImage } from "./PosterImage";

export function MovieCard({ movie, className = "" }) {
  return (
    <article className={["group min-w-0", className].join(" ")}>
      <Link
        to={`/movies/${movie.id}`}
        className="motion-lift block h-full rounded-lg border border-border/75 bg-surface/65 p-2 pb-3 shadow-card transition-[background-color,border-color,box-shadow,transform] duration-[220ms] ease-out hover:-translate-y-1 hover:border-border-strong hover:bg-surface-raised/80 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:translate-y-0"
      >
        <PosterImage
          src={movie.poster}
          title={movie.title}
          year={movie.year}
          sizes="(min-width: 1536px) 190px, (min-width: 1280px) 18vw, (min-width: 768px) 25vw, 46vw"
          className="rounded-md border-border/80 transition-colors duration-[180ms] ease-out group-hover:border-primary/45"
          imageClassName="motion-zoom transition-transform duration-[480ms] ease-out group-hover:scale-[1.035]"
        />
        <div className="px-1.5 pb-0.5 pt-3">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-text sm:text-[1.05rem]">
            {movie.title}
          </h2>
          <div className="mt-2.5">
            <MovieMetadata movie={movie} compact />
          </div>
        </div>
      </Link>
    </article>
  );
}
