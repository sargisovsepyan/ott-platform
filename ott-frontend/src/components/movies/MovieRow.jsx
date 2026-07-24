import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { IconButton } from "../ui/IconButton";
import { MovieCard } from "./MovieCard";

export function MovieRow({ title, eyebrow, movies, viewAllHref = "/movies" }) {
  const scrollerRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(movies.length > 1);

  const updateControls = () => {
    const element = scrollerRef.current;
    if (!element) {
      return;
    }
    setCanScrollPrevious(element.scrollLeft > 8);
    setCanScrollNext(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 8,
    );
  };

  const scroll = (direction) => {
    const element = scrollerRef.current;
    if (!element) {
      return;
    }
    element.scrollBy({
      left: direction * element.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  if (!movies.length) {
    return null;
  }

  return (
    <section aria-labelledby={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="content-container mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-2xl font-semibold tracking-[-0.015em] sm:text-3xl"
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to={viewAllHref}
            className="mr-2 text-sm font-semibold text-primary-hover hover:underline"
          >
            View all
          </Link>
          <div className="hidden md:flex">
            <IconButton
              label={`Scroll ${title} left`}
              disabled={!canScrollPrevious}
              onClick={() => scroll(-1)}
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </IconButton>
            <IconButton
              label={`Scroll ${title} right`}
              disabled={!canScrollNext}
              onClick={() => scroll(1)}
            >
              <ArrowRight className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateControls}
        className="scrollbar-hidden flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:gap-5 lg:gap-6 lg:px-10"
        tabIndex={0}
        aria-label={`${title} movies`}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            className="w-[44vw] shrink-0 snap-start sm:w-[42vw] md:w-48 lg:w-52 xl:w-56"
          />
        ))}
      </div>
    </section>
  );
}
