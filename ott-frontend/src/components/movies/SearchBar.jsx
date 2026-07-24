import { Search, X } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";

export function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-text-subtle"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title"
        aria-label="Search movies by title"
        className="pl-11 pr-12"
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
