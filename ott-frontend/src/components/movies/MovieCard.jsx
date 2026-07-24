import { Link } from "react-router";
import { MovieMetadata } from "./MovieMetadata";
import { PosterImage } from "./PosterImage";

export function MovieCard({ movie, className = "" }) {
  return (
    <article className={["group min-w-0", className].join(" ")}>
      <Link
        to={`/movies/${movie.id}`}
        className="block rounded-sm transition-transform duration-[180ms] ease-out hover:-translate-y-0.5"
      >
        <PosterImage
          src={movie.poster}
          title={movie.title}
          sizes="(min-width: 1536px) 190px, (min-width: 1280px) 18vw, (min-width: 768px) 25vw, 46vw"
          className="transition-colors duration-[140ms] ease-out group-hover:border-border-strong"
        />
        <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-text sm:text-lg">
          {movie.title}
        </h2>
        <div className="mt-2">
          <MovieMetadata movie={movie} compact />
        </div>
      </Link>
    </article>
  );
}
