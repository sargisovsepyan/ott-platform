import { RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { SORT_OPTIONS } from "./movieFilterOptions";

export function FilterToolbar({ filters, onChange, onReset, hasActiveFilters }) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-surface p-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
      <label className="grid gap-2 text-sm font-semibold">
        Year
        <Input
          type="number"
          min="1888"
          max={new Date().getFullYear() + 5}
          value={filters.year}
          onChange={(event) => onChange("year", event.target.value)}
          placeholder="Any year"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Genre
        <Input
          type="text"
          value={filters.genre}
          onChange={(event) => onChange("genre", event.target.value)}
          placeholder="Exact genre"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Sort
        <Select
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
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
          Clear
        </Button>
      </div>
    </div>
  );
}
