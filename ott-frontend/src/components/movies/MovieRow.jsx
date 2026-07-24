import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { IconButton } from "../ui/IconButton";
import { MovieCard } from "./MovieCard";

export function MovieRow({
  title,
  eyebrow,
  description,
  movies,
  viewAllHref = "/movies",
}) {
  const scrollerRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const uniqueMovies = movies.filter(
    (movie, index, collection) =>
      collection.findIndex((candidate) => candidate.id === movie.id) === index,
  );

  const updateControls = useCallback(() => {
    const element = scrollerRef.current;
    if (!element) {
      return;
    }
    setCanScrollPrevious(element.scrollLeft > 8);
    setCanScrollNext(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 8,
    );
  }, []);

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) {
      return undefined;
    }

    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(element);
    return () => observer.disconnect();
  }, [uniqueMovies.length, updateControls]);

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

  if (!uniqueMovies.length) {
    return null;
  }

  return (
    <section
      className="min-w-0 max-w-full overflow-hidden"
      aria-labelledby={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="content-container min-w-0">
        <div className="mb-3 flex min-w-0 items-end justify-between gap-4 sm:mb-4">
          <div className="min-w-0">
          {eyebrow ? (
            <p className="page-eyebrow mb-2">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-2xl font-semibold tracking-[-0.015em] sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-xl text-sm text-text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
          <div className="flex shrink-0 items-center gap-1">
          <Link
            to={viewAllHref}
              className="mr-1 min-h-11 content-center px-2 text-sm font-semibold text-primary-hover hover:underline sm:mr-2"
          >
            View all
          </Link>
            <div className="hidden lg:flex">
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
          className="scrollbar-hidden overscroll-inline-contain flex min-w-0 max-w-full touch-pan-x snap-x snap-proximity gap-3 overflow-x-auto overflow-y-hidden py-4 sm:gap-4 md:gap-5 lg:gap-6"
          tabIndex={0}
          aria-label={`${title} movies`}
        >
          {uniqueMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              className="min-w-36 basis-[44%] shrink-0 snap-start sm:basis-[38%] md:basis-[23%] lg:basis-[18%] 2xl:basis-[14%]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
