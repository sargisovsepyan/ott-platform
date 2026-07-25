import { useEffect, useState } from "react";
import { Clapperboard } from "lucide-react";
import { getMovies } from "../../api/moviesApi";
import { PosterImage } from "../movies/PosterImage";
import { PageContainer } from "./PageContainer";

const AUTH_POSTER_SLOTS = [
  { position: "left", movieIndex: 1 },
  { position: "center", movieIndex: 0 },
  { position: "right", movieIndex: 2 },
];

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getMovies(
      { sort: "-rating", page: 1, limit: 12 },
      { signal: controller.signal },
    )
      .then((result) => {
        setFeaturedMovies(
          result.movies.filter((movie) => movie.poster).slice(0, 3),
        );
      })
      .catch(() => {
        // The poster composition is decorative and must never block authentication.
      });

    return () => controller.abort();
  }, []);

  return (
    <PageContainer className="flex min-h-[calc(100svh-7.5rem)] items-center py-8 sm:py-12 lg:min-h-[calc(100svh-9rem)]">
      <div className="panel-surface grid w-full overflow-hidden rounded-lg lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]">
        <aside className="auth-visual relative hidden min-h-[39rem] overflow-hidden border-r border-border/80 p-10 lg:flex lg:flex-col lg:justify-center lg:gap-8 xl:p-14">
          <div className="auth-poster-stage" aria-hidden="true">
            {AUTH_POSTER_SLOTS.map(({ position, movieIndex }) => {
              const movie = featuredMovies[movieIndex];

              return (
                <div
                  key={position}
                  className={`auth-poster auth-poster-${position}`}
                >
                  {movie ? (
                    <PosterImage
                      src={movie.poster}
                      version={movie.updatedAt}
                      title={movie.title}
                      year={movie.year}
                      loading={position === "center" ? "eager" : "lazy"}
                      sizes="(min-width: 1280px) 180px, 150px"
                      decorative
                      className="auth-poster-media"
                    />
                  ) : (
                    <div className="auth-poster-fallback">
                      <Clapperboard className="size-8" aria-hidden="true" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="relative z-10 max-w-lg">
            <p className="page-eyebrow">Your next discovery</p>
            <p className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em]">
              Cinema, thoughtfully curated.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
              Explore a focused catalogue shaped around strong stories and memorable
              frames.
            </p>
          </div>
        </aside>
        <section className="flex min-w-0 items-center bg-background-elevated/70 px-5 py-9 sm:px-9 sm:py-12 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-md">
            <p className="page-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-text-muted">{description}</p>
            {children}
            {footer ? <div className="mt-7">{footer}</div> : null}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
