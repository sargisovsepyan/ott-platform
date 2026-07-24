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
      <PageContainer className="page-section">
        <div className="grid gap-8 md:grid-cols-[minmax(240px,0.38fr)_1fr] lg:gap-14">
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
      <PageContainer className="page-section">
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
    <PageContainer className="page-section">
      <Link
        to="/movies"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to movies
      </Link>
      <article className="mt-6 grid gap-8 md:grid-cols-[minmax(240px,0.34fr)_1fr] lg:gap-14">
        <PosterImage
          src={movie.poster}
          title={movie.title}
          loading="eager"
          sizes="(min-width: 768px) 32vw, 80vw"
          className="w-full max-w-sm"
        />
        <div className="md:pt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
                Movie
              </p>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.025em] sm:text-5xl lg:text-6xl">
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
          <section className="mt-9 max-w-3xl" aria-labelledby="description-heading">
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
