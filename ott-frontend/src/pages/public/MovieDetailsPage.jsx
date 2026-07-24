import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { getMovie } from "../../api/moviesApi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { MovieMetadata } from "../../components/movies/MovieMetadata";
import { PosterImage } from "../../components/movies/PosterImage";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useAuth } from "../../hooks/useAuth";

export function MovieDetailsPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    movie: null,
    error: "",
    statusCode: 0,
  });
  const retry = useCallback(() => setRequestKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    getMovie(id, { signal: controller.signal })
      .then((movie) => {
        setState({ status: "success", movie, error: "", statusCode: 0 });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            status: "error",
            movie: null,
            error: error.message,
            statusCode: error.status,
          });
        }
      });

    return () => controller.abort();
  }, [id, requestKey]);

  if (state.status === "loading") {
    return (
      <PageContainer className="details-page page-section">
        <div className="panel-surface grid gap-8 rounded-lg p-5 sm:p-8 md:grid-cols-[minmax(240px,0.38fr)_1fr] lg:gap-14 lg:p-10">
          <Skeleton className="aspect-[2/3] w-full max-w-sm" />
          <div className="pt-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-5 h-12 w-4/5" />
            <Skeleton className="mt-5 h-5 w-56" />
            <Skeleton className="mt-8 h-28 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (state.status === "error") {
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

  return (
    <PageContainer className="details-page page-section">
      <Link
        to="/movies"
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-text-muted transition-colors duration-[140ms] ease-out hover:bg-surface-hover hover:text-text"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to movies
      </Link>
      <article className="panel-surface mt-5 grid gap-8 overflow-hidden rounded-lg p-5 sm:p-8 md:grid-cols-[minmax(240px,0.34fr)_1fr] lg:gap-14 lg:p-10">
        <div className="mx-auto w-full max-w-sm md:mx-0">
          <PosterImage
            src={movie.poster}
            title={movie.title}
            year={movie.year}
            loading="eager"
            sizes="(min-width: 768px) 32vw, 80vw"
            className="w-full rounded-lg border-border-strong/80 shadow-panel"
          />
        </div>
        <div className="self-center md:py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="page-eyebrow">Lumio feature</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>
            </div>
            {isAdmin ? (
              <Link
                to={`/admin/movies/${movie.id}/edit`}
                className={buttonClassName("secondary")}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit movie
              </Link>
            ) : null}
          </div>
          <div className="mt-5 max-w-lg">
            <MovieMetadata movie={movie} />
          </div>
          <section className="mt-9 max-w-3xl border-t border-border/70 pt-8" aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-2xl font-semibold">
              About
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">
              {movie.description || "No description available."}
            </p>
          </section>
        </div>
      </article>
    </PageContainer>
  );
}
