import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../ui/IconButton";

function getPageItems(currentPage, totalPages) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const validPages = [...pages].filter((page) => page >= 1 && page <= totalPages);
  validPages.sort((a, b) => a - b);

  const items = [];
  validPages.forEach((page, index) => {
    if (index > 0 && page - validPages[index - 1] > 1) {
      items.push(`ellipsis-${page}`);
    }
    items.push(page);
  });
  return items;
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mx-auto flex w-fit max-w-full items-center justify-center gap-1 rounded-lg border border-border/75 bg-surface/70 p-1.5 shadow-card"
      aria-label="Pagination"
    >
      <IconButton
        label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </IconButton>
      {getPageItems(currentPage, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="grid size-11 place-items-center text-text-subtle">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={[
              "size-11 rounded-md border text-sm font-semibold tabular-nums transition-colors duration-[180ms] ease-out",
              item === currentPage
                ? "border-primary bg-primary-soft text-text"
                : "border-transparent text-text-muted hover:border-border hover:bg-surface-hover hover:text-text",
            ].join(" ")}
            aria-current={item === currentPage ? "page" : undefined}
            aria-label={`Page ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <IconButton
        label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </IconButton>
    </nav>
  );
}
