import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { IconButton } from "../ui/IconButton";
import { MovieCard } from "./MovieCard";

const DRAG_THRESHOLD = 6;

export function MovieRow({
  title,
  eyebrow,
  description,
  movies,
  viewAllHref = "/movies",
}) {
  const headingId = useId();
  const scrollerRef = useRef(null);
  const dragStateRef = useRef({
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const uniqueMovies = movies.filter(
    (movie, index, collection) =>
      collection.findIndex((candidate) => candidate.id === movie.id) === index,
  );
  const movieKey = uniqueMovies.map((movie) => movie.id).join("|");

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
    const animationFrame = window.requestAnimationFrame(updateControls);
    const observer = new ResizeObserver(updateControls);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [movieKey, updateControls]);

  const scroll = (direction) => {
    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.86,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: element.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event) => {
    const element = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!element || dragState.pointerId !== event.pointerId) {
      return;
    }

    const delta = event.clientX - dragState.startX;
    if (!dragState.moved && Math.abs(delta) >= DRAG_THRESHOLD) {
      dragState.moved = true;
      element.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    if (dragState.moved) {
      event.preventDefault();
      element.scrollLeft = dragState.startScrollLeft - delta;
    }
  };

  const endPointerDrag = (event) => {
    const element = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!element || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    suppressClickRef.current = dragState.moved;
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  if (!uniqueMovies.length) {
    return null;
  }

  return (
    <section className="min-w-0 max-w-full overflow-hidden" aria-labelledby={headingId}>
      <div className="content-container min-w-0">
        <div className="mb-3 flex min-w-0 items-end justify-between gap-4 sm:mb-4">
          <div className="min-w-0">
            {eyebrow ? <p className="page-eyebrow mb-2">{eyebrow}</p> : null}
            <h2
              id={headingId}
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
          <Link
            to={viewAllHref}
            state={TOP_SCROLL_STATE}
            className="shrink-0 min-h-11 content-center px-2 text-sm font-semibold text-primary-hover hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="relative min-w-0">
          <div
            ref={scrollerRef}
            onScroll={updateControls}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointerDrag}
            onPointerCancel={endPointerDrag}
            onClickCapture={(event) => {
              if (suppressClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                suppressClickRef.current = false;
              }
            }}
            onDragStart={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                scroll(event.key === "ArrowLeft" ? -1 : 1);
              }
            }}
            className={[
              "scrollbar-hidden overscroll-inline-contain flex min-w-0 max-w-full touch-pan-x snap-x snap-proximity gap-3 overflow-x-auto overflow-y-hidden py-4 sm:gap-4 md:gap-5 lg:gap-6",
              isDragging
                ? "cursor-grabbing select-none snap-none [&_a]:cursor-grabbing"
                : "cursor-grab [&_a]:cursor-pointer",
            ].join(" ")}
            tabIndex={0}
            aria-label={`${title} movies. Use Left and Right Arrow keys to browse.`}
          >
            {uniqueMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                className="min-w-36 basis-[44%] shrink-0 snap-start sm:basis-[38%] md:basis-[23%] lg:basis-[18%] 2xl:basis-[14%]"
              />
            ))}
          </div>
          {canScrollPrevious ? (
            <div className="pointer-events-none absolute inset-y-4 left-0 z-10 flex w-14 items-center bg-gradient-to-r from-background via-background/90 to-transparent sm:w-16">
              <IconButton
                label={`Show previous ${title} movies`}
                className="movie-row-control pointer-events-auto"
                onClick={() => scroll(-1)}
              >
                <ArrowLeft className="size-6" strokeWidth={2.25} aria-hidden="true" />
              </IconButton>
            </div>
          ) : null}
          {canScrollNext ? (
            <div className="pointer-events-none absolute inset-y-4 right-0 z-10 flex w-14 items-center justify-end bg-gradient-to-l from-background via-background/90 to-transparent sm:w-16">
              <IconButton
                label={`Show next ${title} movies`}
                className="movie-row-control pointer-events-auto"
                onClick={() => scroll(1)}
              >
                <ArrowRight className="size-6" strokeWidth={2.25} aria-hidden="true" />
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
