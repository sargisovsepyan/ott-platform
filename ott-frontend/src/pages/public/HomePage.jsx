import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { getMovies } from "../../api/moviesApi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { MovieRow } from "../../components/movies/MovieRow";
import { PosterImage } from "../../components/movies/PosterImage";
import { Badge } from "../../components/ui/Badge";
import { buttonClassName } from "../../components/ui/buttonStyles";

function HeroPosterStage({ movies, featuredMovie }) {
  const featuredIndex = movies.findIndex((movie) => movie.id === featuredMovie.id);

  return (
    <div
      className="hero-stage"
      data-count={movies.length}
      aria-hidden="true"
    >
      {movies.map((movie, index) => {
        const isFeatured = index === featuredIndex;
        const position =
          isFeatured
            ? "hero-poster-featured"
            : index < featuredIndex
              ? "hero-poster-left"
              : "hero-poster-right";

        return (
          <div key={movie.id} className={`hero-poster ${position}`}>
            <PosterImage
              src={movie.poster}
              title={movie.title}
              year={movie.year}
              loading="eager"
              sizes={
                isFeatured
                  ? "(min-width: 1024px) 20rem, 48vw"
                  : "(min-width: 1024px) 16rem, 40vw"
              }
              decorative
              className={[
                "rounded-lg bg-surface-raised shadow-panel",
                isFeatured
                  ? "border-primary/65 shadow-glow"
                  : "border-border-strong/70",
              ].join(" ")}
            />
          </div>
        );
      })}
    </div>
  );
}

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
      <section className="hero-shell">
        <div className="content-container grid min-h-[40rem] items-center gap-6 py-12 md:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="relative z-10 py-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-5 h-16 w-full max-w-2xl" />
            <Skeleton className="mt-4 h-6 w-4/5 max-w-xl" />
            <Skeleton className="mt-7 h-20 w-full max-w-xl" />
            <Skeleton className="mt-8 h-12 w-44" />
          </div>
          <div className="hero-stage">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                className={[
                  "hero-poster aspect-[2/3] rounded-lg",
                  index === 1
                    ? "hero-poster-featured"
                    : index === 0
                      ? "hero-poster-left"
                      : "hero-poster-right",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </section>
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

  const heroMovieCandidates = [featuredMovie, ...state.topRated, ...state.newest]
    .filter(
      (movie, index, movies) =>
        movies.findIndex((candidate) => candidate.id === movie.id) === index,
    )
    .slice(0, 3);
  const heroMovies =
    heroMovieCandidates.length === 3
      ? [heroMovieCandidates[1], heroMovieCandidates[0], heroMovieCandidates[2]]
      : heroMovieCandidates;
  return (
    <div className="min-w-0 pb-20">
      <section className="hero-shell">
        <PageContainer className="grid min-h-[inherit] items-center gap-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:py-12">
          <div className="hero-copy relative z-10 max-w-2xl py-7 md:py-10">
            <p className="page-eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Lumio spotlight
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-7xl">
              {featuredMovie.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-text-muted">
              <span>{featuredMovie.year || "Year unavailable"}</span>
              {featuredMovie.genre ? (
                <>
                  <span className="size-1 rounded-full bg-text-subtle" aria-hidden="true" />
                  <span>{featuredMovie.genre}</span>
                </>
              ) : null}
              <Badge tone="primary">
                {featuredMovie.rating.toFixed(1)} / 10
              </Badge>
            </div>
            <p className="mt-6 line-clamp-3 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              {featuredMovie.description || "Discover this title in the Lumio catalogue."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
              <Link
                to={`/movies/${featuredMovie.id}`}
                className={buttonClassName("primary", "min-w-38")}
              >
                View details
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/movies" className={buttonClassName("secondary")}>
                Browse movies
              </Link>
            </div>
          </div>
          <HeroPosterStage movies={heroMovies} featuredMovie={featuredMovie} />
        </PageContainer>
      </section>
      <div className="home-discovery grid min-w-0 gap-14 pt-12 sm:pt-16 md:gap-20 md:pt-20">
        <MovieRow
          eyebrow="Audience favourites"
          title="Highly rated"
          description="Standout films earning the strongest audience scores."
          movies={state.topRated}
          viewAllHref="/movies?sort=-rating"
        />
        <MovieRow
          eyebrow="Recently released"
          title="New to the catalogue"
          description="Fresh additions, ready for your next discovery."
          movies={state.newest}
          viewAllHref="/movies?sort=-year"
        />
      </div>
    </div>
  );
}
