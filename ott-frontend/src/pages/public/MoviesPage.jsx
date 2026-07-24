import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { getMovies } from "../../api/moviesApi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { PageContainer } from "../../components/layout/PageContainer";
import { FilterToolbar } from "../../components/movies/FilterToolbar";
import { MovieGrid } from "../../components/movies/MovieGrid";
import { MovieGridSkeleton } from "../../components/movies/MovieGridSkeleton";
import { Pagination } from "../../components/movies/Pagination";
import { SearchBar } from "../../components/movies/SearchBar";
import { SORT_OPTIONS } from "../../components/movies/movieFilterOptions";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const validSorts = new Set(SORT_OPTIONS.map((option) => option.value));
const validLimits = new Set([12, 24, 48]);
const maximumYear = new Date().getFullYear() + 5;

function getCatalogueState(searchParams) {
  const yearValue = Number(searchParams.get("year"));
  const pageValue = Number(searchParams.get("page"));
  const limitValue = Number(searchParams.get("limit"));
  const sortValue = searchParams.get("sort");

  return {
    search: searchParams.get("search")?.trim() ?? "",
    year:
      Number.isInteger(yearValue) && yearValue >= 1888 && yearValue <= maximumYear
        ? String(yearValue)
        : "",
    genre: searchParams.get("genre")?.trim() ?? "",
    sort: validSorts.has(sortValue) ? sortValue : "-year",
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    limit: validLimits.has(limitValue) ? limitValue : 12,
  };
}

function DebouncedCatalogueSearch({ value, onSearch }) {
  const [draft, setDraft] = useState(value);
  const debouncedSearch = useDebouncedValue(draft);

  useEffect(() => {
    if (debouncedSearch !== value) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, value]);

  return (
    <SearchBar
      value={draft}
      onChange={setDraft}
      onClear={() => setDraft("")}
    />
  );
}

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogueState = useMemo(
    () => getCatalogueState(searchParams),
    [searchParams],
  );
  const [requestKey, setRequestKey] = useState(0);
  const [result, setResult] = useState({
    status: "loading",
    queryKey: "",
    movies: [],
    total: 0,
    totalPages: 0,
    error: "",
  });
  const queryKey = [
    catalogueState.search,
    catalogueState.year,
    catalogueState.genre,
    catalogueState.sort,
    catalogueState.page,
    catalogueState.limit,
    requestKey,
  ].join("|");
  const displayStatus = result.queryKey === queryKey ? result.status : "loading";

  const updateParams = useCallback(
    (changes, replace = false) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const controller = new AbortController();

    getMovies(
      {
        search: catalogueState.search,
        year: catalogueState.year,
        genre: catalogueState.genre,
        sort: catalogueState.sort,
        page: catalogueState.page,
        limit: catalogueState.limit,
      },
      { signal: controller.signal },
    )
      .then((data) => {
        if (data.totalPages > 0 && catalogueState.page > data.totalPages) {
          updateParams({ page: data.totalPages }, true);
          return;
        }
        setResult({
          status: "success",
          queryKey,
          movies: data.movies,
          total: data.total,
          totalPages: data.totalPages,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult((current) => ({
            ...current,
            status: "error",
            queryKey,
            error: error.message,
          }));
        }
      });

    return () => controller.abort();
  }, [
    catalogueState.genre,
    catalogueState.limit,
    catalogueState.page,
    catalogueState.search,
    catalogueState.sort,
    catalogueState.year,
    requestKey,
    queryKey,
    updateParams,
  ]);

  const handleFilterChange = (key, value) => {
    updateParams({ [key]: value, page: 1 });
  };

  const resetFilters = () => {
    setSearchParams(
      catalogueState.limit === 12 ? {} : { limit: catalogueState.limit },
    );
  };

  const hasActiveFilters = Boolean(
    catalogueState.search ||
      catalogueState.year ||
      catalogueState.genre ||
      catalogueState.sort !== "-year",
  );

  return (
    <PageContainer className="page-section">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
        Catalogue
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
        Movies
      </h1>
      <div className="mt-8 grid gap-4">
        <DebouncedCatalogueSearch
          key={catalogueState.search}
          value={catalogueState.search}
          onSearch={(search) => updateParams({ search, page: 1 }, true)}
        />
        <FilterToolbar
          filters={catalogueState}
          onChange={handleFilterChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-sm text-text-muted" aria-live="polite">
          {displayStatus === "success"
            ? `${result.total} ${result.total === 1 ? "movie" : "movies"}`
            : "Loading catalogue"}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
          Per page
          <Select
            className="min-h-10 w-24"
            value={catalogueState.limit}
            onChange={(event) => handleFilterChange("limit", event.target.value)}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </Select>
        </label>
      </div>
      <div className="mt-7">
        {displayStatus === "loading" ? <MovieGridSkeleton /> : null}
        {displayStatus === "error" ? (
          <ErrorState
            title="The catalogue could not load"
            message={result.error}
            onRetry={() => setRequestKey((value) => value + 1)}
          />
        ) : null}
        {displayStatus === "success" && result.movies.length ? (
          <MovieGrid movies={result.movies} />
        ) : null}
        {displayStatus === "success" && !result.movies.length ? (
          <EmptyState
            title={hasActiveFilters ? "No movies match" : "No movies yet"}
            message={
              hasActiveFilters
                ? "Try changing or clearing the current search and filters."
                : "The catalogue will appear when the first movie is added."
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />
        ) : null}
      </div>
      {displayStatus === "success" ? (
        <div className="mt-10">
          <Pagination
            currentPage={catalogueState.page}
            totalPages={result.totalPages}
            onPageChange={(page) => {
              updateParams({ page });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      ) : null}
    </PageContainer>
  );
}
