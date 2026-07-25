import { useId, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { SORT_OPTIONS } from "./movieFilterOptions";

export function FilterToolbar({
  filters,
  years,
  genres,
  optionsStatus,
  onChange,
  onReset,
  hasActiveFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const activeCount = [
    filters.year,
    filters.genre,
    filters.sort !== "-year",
  ].filter(Boolean).length;

  return (
    <section className="rounded-lg border border-border/80 bg-surface/65 p-4 shadow-card backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <div>
          <p className="font-semibold text-text">Refine catalogue</p>
          <p className="mt-1 text-xs text-text-muted">
            {activeCount ? `${activeCount} active` : "No active filters"}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </Button>
      </div>
      <div
        id={panelId}
        className={[
          "mt-5 gap-4 md:mt-0 md:grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto]",
          isOpen ? "grid" : "hidden",
        ].join(" ")}
      >
        <label className="grid gap-2 text-sm font-semibold">
          Year
          <Select
            value={filters.year}
            onChange={(event) => onChange("year", event.target.value)}
            disabled={optionsStatus !== "success"}
            className={
              filters.year
                ? "border-primary/70 bg-primary-soft/45"
                : "text-text-muted"
            }
          >
            <option value="">Any year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Genre
          <Select
            value={filters.genre}
            onChange={(event) => onChange("genre", event.target.value)}
            disabled={optionsStatus !== "success"}
            className={
              filters.genre
                ? "border-primary/70 bg-primary-soft/45"
                : "text-text-muted"
            }
          >
            <option value="">Any genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Sort
          <Select
            value={filters.sort}
            onChange={(event) => onChange("sort", event.target.value)}
            className={
              filters.sort !== "-year"
                ? "border-primary/70 bg-primary-soft/45"
                : ""
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        <div className="flex items-end">
          <Button
            variant="ghost"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="w-full lg:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      </div>
      <p className="sr-only" role="status">
        {optionsStatus === "loading"
          ? "Loading available years and genres"
          : optionsStatus === "success"
            ? `${years.length} years and ${genres.length} genres available`
            : "Available years and genres could not be loaded"}
      </p>
    </section>
  );
}
