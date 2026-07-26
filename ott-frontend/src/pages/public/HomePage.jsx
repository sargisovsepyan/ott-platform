import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { getHomepage } from "../../api/homepageApi";
import { getAllMovies } from "../../api/moviesApi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { GenreBrowseSection } from "../../components/home/GenreBrowseSection";
import { HomeFinalCta } from "../../components/home/HomeFinalCta";
import { MembershipPlansSection } from "../../components/home/MembershipPlansSection";
import { PageContainer } from "../../components/layout/PageContainer";
import { MovieRow } from "../../components/movies/MovieRow";
import { PosterImage } from "../../components/movies/PosterImage";
import { Badge } from "../../components/ui/Badge";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { createMovieDetailState } from "../../utils/movieNavigation";
import {
  TOP_SCROLL_STATE,
  scrollToMembershipSection,
} from "../../utils/scrollNavigation";

function compareByTitle(first, second) {
  return first.title.localeCompare(second.title, undefined, {
    sensitivity: "base",
  });
}

function compareSpotlightMovies(first, second) {
  return (
    second.rating - first.rating ||
    second.year - first.year ||
    compareByTitle(first, second)
  );
}

function compareNewestMovies(first, second) {
  return (
    second.year - first.year ||
    second.rating - first.rating ||
    compareByTitle(first, second)
  );
}

function hasValidPoster(poster) {
  if (typeof poster !== "string" || !poster.trim()) {
    return false;
  }

  try {
    const url = new URL(poster);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function hasMeaningfulDescription(description) {
  if (typeof description !== "string") {
    return false;
  }

  const normalized = description.trim().replace(/\s+/g, " ");
  return normalized.length >= 18 && normalized.split(" ").length >= 3;
}

function getUniqueMovies(movies) {
  return movies.filter(
    (movie, index, collection) =>
      movie.id &&
      collection.findIndex((candidate) => candidate.id === movie.id) === index,
  );
}

function getCtaCandidates(movies) {
  return getUniqueMovies(movies)
    .filter(
      (movie) =>
        movie.id &&
        movie.title?.trim() &&
        hasValidPoster(movie.poster) &&
        hasMeaningfulDescription(movie.description),
    )
    .sort(compareSpotlightMovies)
    .slice(0, 8);
}

function getVisibleHeroMovies(movies, activeIndex) {
  if (movies.length <= 1) {
    return movies.map((movie, index) => ({
      movie,
      index,
      position: "hero-poster-featured",
    }));
  }

  if (movies.length === 2) {
    const adjacentIndex = (activeIndex + 1) % movies.length;
    return [
      {
        movie: movies[activeIndex],
        index: activeIndex,
        position: "hero-poster-featured",
      },
      {
        movie: movies[adjacentIndex],
        index: adjacentIndex,
        position: "hero-poster-right",
      },
    ];
  }

  const previousIndex = (activeIndex - 1 + movies.length) % movies.length;
  const nextIndex = (activeIndex + 1) % movies.length;
  return [
    {
      movie: movies[previousIndex],
      index: previousIndex,
      position: "hero-poster-left",
    },
    {
      movie: movies[activeIndex],
      index: activeIndex,
      position: "hero-poster-featured",
    },
    {
      movie: movies[nextIndex],
      index: nextIndex,
      position: "hero-poster-right",
    },
  ];
}

function HeroPosterStage({ movies, activeIndex, onSelect, detailState }) {
  const visibleMovies = getVisibleHeroMovies(movies, activeIndex);

  return (
    <div className="hero-stage" data-count={movies.length}>
      {visibleMovies.map(({ movie, index, position }) => {
        const isFeatured = position === "hero-poster-featured";
        const poster = (
          <PosterImage
            src={movie.poster}
            version={movie.updatedAt}
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
        );

        return (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            state={detailState}
            className={`hero-poster ${position}`}
            onClick={
              isFeatured
                ? undefined
                : (event) => {
                    event.preventDefault();
                    onSelect(index);
                  }
            }
            aria-label={
              isFeatured
                ? `View details for ${movie.title}`
                : `Feature ${movie.title}`
            }
            aria-current={isFeatured ? "true" : undefined}
          >
            {poster}
          </Link>
        );
      })}
      {movies.length > 1 ? (
        <div className="hero-position-indicator" aria-label="Choose featured movie">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              className={[
                "hero-position-dot",
                index === activeIndex ? "hero-position-dot-active" : "",
              ].join(" ")}
              onClick={() => onSelect(index)}
              aria-label={`Feature ${movie.title}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HomePage() {
  const location = useLocation();
  const [state, setState] = useState({
    status: "loading",
    homepageMovies: [],
    movies: [],
    error: "",
  });
  const [requestKey, setRequestKey] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroFocused, setIsHeroFocused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const catalogueMovies = useMemo(
    () => getUniqueMovies(state.movies),
    [state.movies],
  );
  const topRatedMovies = useMemo(
    () => [...catalogueMovies].sort(compareSpotlightMovies).slice(0, 18),
    [catalogueMovies],
  );
  const newestMovies = useMemo(
    () => [...catalogueMovies].sort(compareNewestMovies).slice(0, 18),
    [catalogueMovies],
  );
  const ctaMovies = useMemo(
    () => getCtaCandidates(catalogueMovies),
    [catalogueMovies],
  );
  const heroMovies = state.homepageMovies;
  const homeDetailState = createMovieDetailState(location, "Back to Home");
  const resolvedHeroIndex = heroMovies.length
    ? activeHeroIndex % heroMovies.length
    : 0;

  const moveHero = useCallback(
    (direction) => {
      if (heroMovies.length < 2) {
        return;
      }
      setActiveHeroIndex(
        (current) =>
          (current + direction + heroMovies.length) % heroMovies.length,
      );
    },
    [heroMovies.length],
  );

  const loadMovies = useCallback(() => {
    setState((current) => ({ ...current, status: "loading", error: "" }));
    setRequestKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsDocumentHidden(document.hidden);
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreferenceChange = () =>
      setIsReducedMotion(mediaQuery.matches);

    handleMotionPreferenceChange();
    mediaQuery.addEventListener("change", handleMotionPreferenceChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
  }, []);

  useEffect(() => {
    if (location.hash !== "#plans" || state.status !== "success") {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToMembershipSection();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key, state.status]);

  useEffect(() => {
    if (
      heroMovies.length < 2 ||
      isHeroHovered ||
      isHeroFocused ||
      isDocumentHidden ||
      isReducedMotion
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => moveHero(1), 6500);
    return () => window.clearTimeout(timer);
  }, [
    activeHeroIndex,
    heroMovies.length,
    isDocumentHidden,
    isHeroFocused,
    isHeroHovered,
    isReducedMotion,
    moveHero,
  ]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getHomepage({ signal: controller.signal }),
      getAllMovies({ sort: "-rating" }, { signal: controller.signal }),
    ])
      .then(([homepage, movies]) => {
        setState({
          status: "success",
          homepageMovies: homepage.movies,
          movies,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            status: "error",
            homepageMovies: [],
            movies: [],
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

  const featuredMovie = heroMovies[resolvedHeroIndex] ?? heroMovies[0];

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
    <div className="min-w-0 pb-20">
      <section
        className="hero-shell"
        aria-label="Featured movies"
        aria-roledescription="carousel"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        onFocusCapture={() => setIsHeroFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsHeroFocused(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveHero(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <PageContainer className="grid min-h-[inherit] items-center gap-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:py-12">
          <div
            key={featuredMovie.id}
            className="hero-copy relative z-10 max-w-2xl py-7 md:py-10"
          >
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
                state={homeDetailState}
                className={buttonClassName("primary", "min-w-38")}
              >
                View details
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/movies"
                state={TOP_SCROLL_STATE}
                className={buttonClassName("secondary")}
              >
                Browse movies
              </Link>
            </div>
          </div>
          <HeroPosterStage
            movies={heroMovies}
            activeIndex={resolvedHeroIndex}
            onSelect={setActiveHeroIndex}
            detailState={homeDetailState}
          />
        </PageContainer>
      </section>
      <div className="home-discovery grid min-w-0 gap-14 pt-12 sm:pt-16 md:gap-20 md:pt-20">
        <MovieRow
          eyebrow="Audience favourites"
          title="Highly rated"
          description="Standout films earning the strongest audience scores."
          movies={topRatedMovies}
          viewAllHref="/movies?sort=-rating"
        />
        <MovieRow
          eyebrow="Recently released"
          title="New to the catalogue"
          description="Fresh additions, ready for your next discovery."
          movies={newestMovies}
          viewAllHref="/movies?sort=-year"
        />
        <GenreBrowseSection movies={catalogueMovies} />
        <MembershipPlansSection />
        <HomeFinalCta movies={ctaMovies.length ? ctaMovies : topRatedMovies} />
      </div>
    </div>
  );
}
