import { Search, X } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";

export function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary-hover"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title"
        aria-label="Search movies by title"
        className="min-h-14 rounded-lg border-border-strong/80 bg-background-elevated/90 pl-12 pr-12 text-base shadow-card focus:bg-surface-raised"
      />
      {value ? (
        <IconButton
          label="Clear search"
          onClick={onClear}
          className="absolute right-0.5 top-1/2 -translate-y-1/2"
        >
          <X className="size-4" aria-hidden="true" />
        </IconButton>
      ) : null}
    </div>
  );
}
