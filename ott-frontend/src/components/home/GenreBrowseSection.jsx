import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { PageContainer } from "../layout/PageContainer";
import { PosterImage } from "../movies/PosterImage";

function normalizeGenre(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function compareMovies(first, second) {
  return (
    second.rating - first.rating ||
    second.year - first.year ||
    first.title.localeCompare(second.title, undefined, { sensitivity: "base" })
  );
}

function buildGenreGroups(movies) {
  const groupsByKey = new Map();

  movies.forEach((movie) => {
    const name = normalizeGenre(movie.genre);
    if (!name) {
      return;
    }

    const key = name.toLocaleLowerCase();
    const group = groupsByKey.get(key) ?? { name, movies: [] };
    if (!group.movies.some((candidate) => candidate.id === movie.id)) {
      group.movies.push(movie);
    }
    groupsByKey.set(key, group);
  });

  return [...groupsByKey.values()]
    .map((group) => ({
      ...group,
      movies: [...group.movies].sort(compareMovies),
      count: group.movies.length,
    }))
    .sort(
      (first, second) =>
        second.count - first.count ||
        first.name.localeCompare(second.name, undefined, {
          sensitivity: "base",
        }),
    )
    .slice(0, 8);
}

export function GenreBrowseSection({ movies }) {
  const genres = useMemo(() => buildGenreGroups(movies), [movies]);

  if (!genres.length) {
    return null;
  }

  return (
    <section className="ambient-section" aria-labelledby="genre-browse-heading">
      <PageContainer>
        <header>
          <p className="page-eyebrow">Explore Lumio</p>
          <h2
            id="genre-browse-heading"
            className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl"
          >
            Browse by genre
          </h2>
          <p className="mt-3 text-text-muted">Find a story for every mood.</p>
        </header>
        <div className="mt-7 grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {genres.map((genre) => {
            const searchParams = new URLSearchParams({
              genre: genre.name,
              page: "1",
            });
            const posterMovies = genre.movies
              .filter((movie) => movie.poster?.trim())
              .slice(0, 3);

            return (
              <Link
                key={genre.name}
                to={`/movies?${searchParams.toString()}`}
                state={TOP_SCROLL_STATE}
                className="genre-tile group"
                aria-label={`Browse ${genre.name}: ${genre.count} ${
                  genre.count === 1 ? "movie" : "movies"
                }`}
              >
                <span className="genre-tile-art" aria-hidden="true">
                  {posterMovies.map((movie, index) => (
                    <PosterImage
                      key={movie.id}
                      src={movie.poster}
                      version={movie.updatedAt}
                      title={movie.title}
                      year={movie.year}
                      decorative
                      sizes="(min-width: 1024px) 150px, 42vw"
                      className={`genre-tile-poster genre-tile-poster-${index + 1}`}
                      imageClassName="transition-transform duration-[360ms] ease-out group-hover:scale-[1.04]"
                    />
                  ))}
                </span>
                <span className="genre-tile-overlay" aria-hidden="true" />
                <span className="relative z-10 mt-auto flex items-end justify-between gap-3 p-4 sm:p-5">
                  <span>
                    <strong className="block text-lg font-semibold text-text sm:text-xl">
                      {genre.name}
                    </strong>
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                      {genre.count} {genre.count === 1 ? "movie" : "movies"}
                    </span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border-strong bg-background/85 text-text transition-[border-color,color,transform] duration-[180ms] ease-out group-hover:border-primary group-hover:text-primary-hover group-focus-visible:border-primary group-focus-visible:text-primary-hover">
                    <ArrowUpRight className="size-4.5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
