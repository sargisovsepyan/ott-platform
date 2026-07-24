import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { getMovies } from "../../api/moviesApi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { MovieRow } from "../../components/movies/MovieRow";
import { PosterImage } from "../../components/movies/PosterImage";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function HomePage() {
  const [state, setState] = useState({
    status: "loading",
    topRated: [],
    newest: [],
    error: "",
  });
  const [requestKey, setRequestKey] = useState(0);

  const loadMovies = useCallback(() => {
    setState((current) => ({ ...current, status: "loading", error: "" }));
    setRequestKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getMovies({ sort: "-rating", limit: 18 }, { signal: controller.signal }),
      getMovies({ sort: "-year", limit: 18 }, { signal: controller.signal }),
    ])
      .then(([ratedResult, newestResult]) => {
        setState({
          status: "success",
          topRated: ratedResult.movies,
          newest: newestResult.movies,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            status: "error",
            topRated: [],
            newest: [],
            error: error.message,
          });
        }
      });

    return () => controller.abort();
  }, [requestKey]);

  if (state.status === "loading") {
    return (
      <div>
        <div className="content-container grid min-h-[70svh] items-center gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
            <Skeleton className="mt-4 h-6 w-4/5 max-w-xl" />
            <Skeleton className="mt-8 h-12 w-40" />
          </div>
          <Skeleton className="mx-auto aspect-[2/3] w-full max-w-sm" />
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <PageContainer className="page-section">
        <ErrorState
          title="The catalogue is unavailable"
          message={state.error}
          onRetry={loadMovies}
        />
      </PageContainer>
    );
  }

  const featuredMovie = state.topRated[0] ?? state.newest[0];

  if (!featuredMovie) {
    return (
      <PageContainer className="page-section">
        <EmptyState
          title="The screen is ready"
          message="There are no movies in the catalogue yet. Check back after an administrator adds the first title."
        />
      </PageContainer>
    );
  }

  return (
    <div className="pb-16">
      <section className="relative min-h-[72svh] overflow-hidden border-b border-border lg:min-h-[78svh]">
        <PageContainer className="grid min-h-[72svh] items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] lg:min-h-[78svh]">
          <div className="relative z-10 max-w-2xl bg-background py-6 md:pr-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-hover">
              Featured
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              {featuredMovie.title}
            </h1>
            <p className="mt-4 text-sm font-medium text-text-muted">
              {featuredMovie.year || "Year unavailable"}
              {featuredMovie.genre ? ` • ${featuredMovie.genre}` : ""}
              {` • ${featuredMovie.rating.toFixed(1)}/10`}
            </p>
            <p className="mt-5 line-clamp-3 max-w-xl text-lg text-text-muted">
              {featuredMovie.description || "Discover this title in the Lumio catalogue."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/movies/${featuredMovie.id}`}
                className={buttonClassName("primary")}
              >
                View details
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/movies" className={buttonClassName("secondary")}>
                Browse movies
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <PosterImage
              src={featuredMovie.poster}
              title={featuredMovie.title}
              loading="eager"
              sizes="(min-width: 768px) 40vw, 80vw"
              className="border-border-strong"
            />
          </div>
        </PageContainer>
      </section>
      <div className="mt-14 grid gap-16 md:mt-16">
        <MovieRow
          eyebrow="Audience favourites"
          title="Highly rated"
          movies={state.topRated}
          viewAllHref="/movies?sort=-rating"
        />
        <MovieRow
          eyebrow="Recently released"
          title="New to the catalogue"
          movies={state.newest}
          viewAllHref="/movies?sort=-year"
        />
      </div>
    </div>
  );
}
