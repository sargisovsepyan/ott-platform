import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { getAllMovies, getMovie } from "../../api/moviesApi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { MoviePlayer } from "../../components/movies/MoviePlayer";
import { MovieRow } from "../../components/movies/MovieRow";
import { PosterImage } from "../../components/movies/PosterImage";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useAuth } from "../../hooks/useAuth";
import {
  getMovieOriginHref,
  getMovieReturnOrigin,
} from "../../utils/movieNavigation";
import {
  createRestoreScrollState,
  createTopScrollState,
} from "../../utils/scrollNavigation";

function normalizeGenre(value) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").toLocaleLowerCase()
    : "";
}

function compareRelatedMovies(first, second) {
  return (
    second.rating - first.rating ||
    second.year - first.year ||
    first.title.localeCompare(second.title, undefined, { sensitivity: "base" })
  );
}

function getRelatedMovies(movie, catalogue) {
  const genre = normalizeGenre(movie.genre);
  const available = catalogue
    .filter((candidate) => candidate.id !== movie.id)
    .filter(
      (candidate, index, collection) =>
        collection.findIndex((item) => item.id === candidate.id) === index,
    )
    .sort(compareRelatedMovies);
  const sameGenre = genre
    ? available.filter((candidate) => normalizeGenre(candidate.genre) === genre)
    : [];
  const related = sameGenre.slice(0, 6);

  if (related.length < 3) {
    available.forEach((candidate) => {
      if (
        related.length < 6 &&
        !related.some((movieCandidate) => movieCandidate.id === candidate.id)
      ) {
        related.push(candidate);
      }
    });
  }

  return related;
}

export function MovieDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    movieId: "",
    movie: null,
    catalogue: [],
    error: "",
    statusCode: 0,
  });
  const retry = useCallback(() => setRequestKey((value) => value + 1), []);
  const displayStatus = state.movieId === id ? state.status : "loading";
  const returnOrigin = getMovieReturnOrigin(location.state);
  const relatedMovies = useMemo(
    () =>
      state.movie && state.movieId === id
        ? getRelatedMovies(state.movie, state.catalogue)
        : [],
    [id, state.catalogue, state.movie, state.movieId],
  );

  useEffect(() => {
    const controller = new AbortController();

    const catalogueRequest = getAllMovies(
      { sort: "-rating" },
      { signal: controller.signal },
    ).catch((error) => {
      if (error.name === "AbortError") {
        throw error;
      }
      return [];
    });

    Promise.all([
      getMovie(id, { signal: controller.signal }),
      catalogueRequest,
    ])
      .then(([movie, catalogue]) => {
        setState({
          status: "success",
          movieId: id,
          movie,
          catalogue,
          error: "",
          statusCode: 0,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            status: "error",
            movieId: id,
            movie: null,
            catalogue: [],
            error: error.message,
            statusCode: error.status,
          });
        }
      });

    return () => controller.abort();
  }, [id, requestKey]);

  if (displayStatus === "loading") {
    return (
      <PageContainer className="details-page page-section">
        <div className="panel-surface grid gap-8 rounded-lg p-5 sm:p-8 md:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-14 lg:p-10">
          <Skeleton className="mx-auto aspect-[2/3] w-full max-w-80 md:mx-0" />
          <div className="md:py-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-5 h-12 w-4/5" />
            <Skeleton className="mt-8 h-32 w-full max-w-xl" />
            <Skeleton className="mt-8 h-7 w-24" />
            <Skeleton className="mt-5 h-24 w-full" />
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-5xl sm:mt-12">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-5 aspect-video w-full" />
        </div>
      </PageContainer>
    );
  }

  if (displayStatus === "error") {
    const isNotFound = state.statusCode === 404;
    return (
      <PageContainer className="details-page page-section">
        <ErrorState
          title={isNotFound ? "Movie not found" : "Movie details are unavailable"}
          message={
            isNotFound
              ? "This movie may have been removed from the catalogue."
              : state.error
          }
          onRetry={isNotFound ? undefined : retry}
        />
      </PageContainer>
    );
  }

  const { movie } = state;
  const relatedSearchParams = new URLSearchParams(
    movie.genre?.trim()
      ? { genre: movie.genre.trim(), page: "1" }
      : { sort: "-rating", page: "1" },
  );

  return (
    <div className="details-page page-section">
      <PageContainer>
        <Link
          to={getMovieOriginHref(returnOrigin)}
          state={
            returnOrigin.locationKey
              ? createRestoreScrollState(returnOrigin.locationKey)
              : createTopScrollState()
          }
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-text-muted transition-colors duration-[140ms] ease-out hover:bg-surface-hover hover:text-text"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {returnOrigin.label}
        </Link>
        <article className="panel-surface mt-5 overflow-hidden rounded-lg p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 md:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-14">
            <div className="mx-auto w-full max-w-80 md:mx-0">
              <PosterImage
                src={movie.poster}
                version={movie.updatedAt}
                title={movie.title}
                year={movie.year}
                loading="eager"
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 260px, 80vw"
                className="w-full rounded-lg border-border-strong/80 shadow-panel"
              />
            </div>
            <div className="min-w-0 md:py-2">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className="page-eyebrow">Lumio feature</p>
                  <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    {movie.title}
                  </h1>
                </div>
                {isAdmin ? (
                  <div className="hidden shrink-0 md:block">
                    <Link
                      to={`/admin/movies/${movie.id}/edit`}
                      className={buttonClassName("secondary")}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit movie
                    </Link>
                  </div>
                ) : null}
              </div>

              <dl
                className="mt-7 max-w-xl border-y border-border/70"
                aria-label="Movie information"
              >
                {movie.genre ? (
                  <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-border/60 py-3">
                    <dt className="text-sm font-medium text-text-subtle">
                      Genre
                    </dt>
                    <dd className="min-w-0 text-sm font-semibold text-text">
                      {movie.genre}
                    </dd>
                  </div>
                ) : null}
                {movie.year ? (
                  <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-border/60 py-3">
                    <dt className="text-sm font-medium text-text-subtle">
                      Year
                    </dt>
                    <dd className="text-sm font-semibold tabular-nums text-text">
                      {movie.year}
                    </dd>
                  </div>
                ) : null}
                <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-3">
                  <dt className="text-sm font-medium text-text-subtle">
                    Rating
                  </dt>
                  <dd className="text-sm font-semibold tabular-nums text-text">
                    {movie.rating.toFixed(1)} / 10
                  </dd>
                </div>
              </dl>

              {isAdmin ? (
                <div className="mt-6 md:hidden">
                  <Link
                    to={`/admin/movies/${movie.id}/edit`}
                    className={buttonClassName("secondary")}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit movie
                  </Link>
                </div>
              ) : null}

              <section
                className="mt-8 max-w-3xl"
                aria-labelledby="description-heading"
              >
                <h2 id="description-heading" className="text-2xl font-semibold">
                  About
                </h2>
                <p className="mt-4 break-words text-base leading-relaxed text-text-muted sm:text-lg">
                  {movie.description || "No description available."}
                </p>
              </section>
            </div>
          </div>
        </article>

        <section
          className="mx-auto mt-10 w-full max-w-5xl sm:mt-12"
          aria-labelledby="watch-heading"
        >
          <h2
            id="watch-heading"
            className="text-2xl font-semibold tracking-[-0.015em] sm:text-3xl"
          >
            Watch movie
          </h2>
          <MoviePlayer movie={movie} className="mt-5" />
        </section>
      </PageContainer>
      {relatedMovies.length ? (
        <div className="mt-12 sm:mt-14">
          <MovieRow
            eyebrow="Continue discovering"
            title="More like this"
            description="Related titles selected from the Lumio catalogue."
            movies={relatedMovies}
            viewAllHref={`/movies?${relatedSearchParams.toString()}`}
          />
        </div>
      ) : null}
    </div>
  );
}
