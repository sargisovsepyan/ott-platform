import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePlansNavigation } from "../../hooks/usePlansNavigation";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { PageContainer } from "../layout/PageContainer";
import { PosterImage } from "../movies/PosterImage";
import { buttonClassName } from "../ui/buttonStyles";

export function HomeFinalCta({ movies }) {
  const { isAuthenticated } = useAuth();
  const handlePlansNavigation = usePlansNavigation();
  const posterMovies = movies
    .filter((movie) => movie.poster?.trim())
    .slice(0, 3);

  return (
    <section aria-labelledby="home-cta-heading">
      <PageContainer>
        <div className="home-final-cta">
          <div className="relative z-10 max-w-2xl">
            <p className="page-eyebrow">Start exploring</p>
            <h2
              id="home-cta-heading"
              className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              Your next story is waiting.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Explore original films across worlds, genres and generations.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/movies"
                state={TOP_SCROLL_STATE}
                className={buttonClassName("primary", "min-w-44")}
              >
                Browse the catalogue
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/#plans"
                  className={buttonClassName("secondary")}
                  onClick={handlePlansNavigation}
                >
                  Explore plans
                </Link>
              ) : (
                <Link
                  to="/register"
                  state={TOP_SCROLL_STATE}
                  className={buttonClassName("secondary")}
                >
                  Create an account
                </Link>
              )}
            </div>
          </div>
          <div className="home-final-cta-art" aria-hidden="true">
            {posterMovies.map((movie, index) => (
              <PosterImage
                key={movie.id}
                src={movie.poster}
                version={movie.updatedAt}
                title={movie.title}
                year={movie.year}
                decorative
                sizes="(min-width: 1024px) 160px, 35vw"
                className={`home-final-cta-poster home-final-cta-poster-${index + 1}`}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
