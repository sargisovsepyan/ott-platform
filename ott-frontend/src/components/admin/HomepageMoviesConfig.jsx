import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import {
  getHomepage,
  getHomepageConfig,
  updateHomepageConfig,
} from "../../api/homepageApi";
import { getMovies } from "../../api/moviesApi";
import { Alert } from "../feedback/Alert";
import { EmptyState } from "../feedback/EmptyState";
import { ErrorState } from "../feedback/ErrorState";
import { Skeleton } from "../feedback/Skeleton";
import { Pagination } from "../movies/Pagination";
import { PosterImage } from "../movies/PosterImage";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const MAX_SELECTED_MOVIES = 10;
const AVAILABLE_PAGE_SIZE = 6;

function arraysEqual(first, second) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

function getRequestMessage(error) {
  if (Array.isArray(error?.errors) && error.errors.length) {
    return error.errors
      .map((item) => item?.message)
      .filter(Boolean)
      .join(" ");
  }

  return error?.message || "Something went wrong. Please try again.";
}

function clampDisplayCount(value, movieCount) {
  if (!movieCount) {
    return 0;
  }

  const count = Number(value);
  return Math.min(
    movieCount,
    Math.max(1, Number.isInteger(count) ? count : 1),
  );
}

function restoreConfiguredMovies(config) {
  const moviesById = new Map(config.movies.map((movie) => [movie.id, movie]));
  const movies = config.movieIds
    .map((movieId) => moviesById.get(movieId))
    .filter(Boolean);

  return {
    movies,
    missingCount: config.movieIds.length - movies.length,
  };
}

function AvailableMovie({
  movie,
  isSelected,
  selectionIsFull,
  onAdd,
}) {
  return (
    <article className="flex items-center gap-3 rounded-md border border-border/75 bg-surface/55 p-3">
      <PosterImage
        src={movie.poster}
        version={movie.updatedAt}
        title={movie.title}
        year={movie.year}
        className="w-12 shrink-0 rounded-sm"
      />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold">{movie.title}</h4>
        <p className="mt-1 truncate text-xs text-text-subtle">
          {movie.year || "Year unavailable"}
          {movie.genre ? ` · ${movie.genre}` : ""}
        </p>
      </div>
      <Button
        variant="secondary"
        className="min-h-10 shrink-0 px-3"
        disabled={isSelected || selectionIsFull}
        onClick={() => onAdd(movie)}
        aria-label={
          isSelected
            ? `${movie.title} is already selected`
            : `Add ${movie.title} to the homepage`
        }
      >
        <Plus className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{isSelected ? "Added" : "Add"}</span>
      </Button>
    </article>
  );
}

function SelectedMovie({
  movie,
  index,
  isVisible,
  isFirst,
  isLast,
  onMove,
  onRemove,
}) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border/75 bg-surface/55 p-3">
      <span className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums text-text-subtle">
        {index + 1}
      </span>
      <PosterImage
        src={movie.poster}
        version={movie.updatedAt}
        title={movie.title}
        year={movie.year}
        className="w-12 shrink-0 rounded-sm"
      />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold">{movie.title}</h4>
        <div className="mt-1.5">
          <Badge tone={isVisible ? "success" : "neutral"}>
            {isVisible ? "Visible" : "Not shown"}
          </Badge>
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <IconButton
          label={`Move ${movie.title} up`}
          disabled={isFirst}
          onClick={() => onMove(index, -1)}
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton
          label={`Move ${movie.title} down`}
          disabled={isLast}
          onClick={() => onMove(index, 1)}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton
          label={`Remove ${movie.title} from the homepage`}
          className="hover:border-danger/60 hover:bg-danger/10 hover:text-danger"
          onClick={() => onRemove(movie.id)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </IconButton>
      </div>
    </li>
  );
}

export function HomepageMoviesConfig() {
  const [configRequestKey, setConfigRequestKey] = useState(0);
  const [configState, setConfigState] = useState({
    status: "loading",
    configured: false,
    selectedMovies: [],
    displayCount: 0,
    savedMovieIds: [],
    savedDisplayCount: 0,
    missingCount: 0,
    error: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [availableRequestKey, setAvailableRequestKey] = useState(0);
  const [availableState, setAvailableState] = useState({
    status: "loading",
    queryKey: "",
    movies: [],
    totalPages: 0,
    error: "",
  });
  const [selectionMessage, setSelectionMessage] = useState("");
  const [saveState, setSaveState] = useState({
    status: "idle",
    message: "",
  });

  const selectedIds = useMemo(
    () => configState.selectedMovies.map((movie) => movie.id),
    [configState.selectedMovies],
  );
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const isDirty =
    configState.status === "success" &&
    (!configState.configured ||
      !arraysEqual(selectedIds, configState.savedMovieIds) ||
      configState.displayCount !== configState.savedDisplayCount);
  const validationMessage =
    !selectedIds.length
      ? "Select at least one movie before saving."
      : selectedIds.length > MAX_SELECTED_MOVIES
        ? `Select no more than ${MAX_SELECTED_MOVIES} movies.`
        : configState.displayCount < 1 ||
            configState.displayCount > selectedIds.length
          ? "Visible movie count must be between 1 and the number selected."
          : "";
  const availableQueryKey = [
    search,
    page,
    availableRequestKey,
  ].join("|");
  const availableStatus =
    availableState.queryKey === availableQueryKey
      ? availableState.status
      : "loading";

  const retryConfig = useCallback(() => {
    setConfigState((current) => ({
      ...current,
      status: "loading",
      error: "",
    }));
    setSaveState({ status: "idle", message: "" });
    setSelectionMessage("");
    setConfigRequestKey((value) => value + 1);
  }, []);
  const retryAvailable = useCallback(
    () => setAvailableRequestKey((value) => value + 1),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    getHomepageConfig({ signal: controller.signal })
      .then(async (config) => {
        if (config.configured) {
          return { config, fallback: null };
        }

        const fallback = await getHomepage({ signal: controller.signal });
        return { config, fallback };
      })
      .then(({ config, fallback }) => {
        if (fallback) {
          const selectedMovies = fallback.movies;
          const displayCount = clampDisplayCount(
            fallback.displayCount,
            selectedMovies.length,
          );
          setConfigState({
            status: "success",
            configured: false,
            selectedMovies,
            displayCount,
            savedMovieIds: selectedMovies.map((movie) => movie.id),
            savedDisplayCount: displayCount,
            missingCount: 0,
            error: "",
          });
          return;
        }

        const restored = restoreConfiguredMovies(config);
        setConfigState({
          status: "success",
          configured: true,
          selectedMovies: restored.movies,
          displayCount: clampDisplayCount(
            config.displayCount,
            restored.movies.length,
          ),
          savedMovieIds: config.movieIds,
          savedDisplayCount: config.displayCount,
          missingCount: restored.missingCount,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setConfigState((current) => ({
            ...current,
            status: "error",
            error: getRequestMessage(error),
          }));
        }
      });

    return () => controller.abort();
  }, [configRequestKey]);

  useEffect(() => {
    const controller = new AbortController();

    getMovies(
      {
        search,
        page,
        limit: AVAILABLE_PAGE_SIZE,
        sort: "title",
      },
      { signal: controller.signal },
    )
      .then((data) => {
        if (data.totalPages > 0 && page > data.totalPages) {
          setPage(data.totalPages);
          return;
        }

        setAvailableState({
          status: "success",
          queryKey: availableQueryKey,
          movies: data.movies,
          totalPages: data.totalPages,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setAvailableState((current) => ({
            ...current,
            status: "error",
            queryKey: availableQueryKey,
            error: getRequestMessage(error),
          }));
        }
      });

    return () => controller.abort();
  }, [availableQueryKey, page, search]);

  const clearMessages = () => {
    setSelectionMessage("");
    setSaveState({ status: "idle", message: "" });
  };

  const handleAdd = (movie) => {
    if (selectedIdSet.has(movie.id)) {
      return;
    }
    if (selectedIds.length >= MAX_SELECTED_MOVIES) {
      setSelectionMessage(
        `The homepage can contain up to ${MAX_SELECTED_MOVIES} movies.`,
      );
      return;
    }

    clearMessages();
    setConfigState((current) => ({
      ...current,
      selectedMovies: [...current.selectedMovies, movie],
      displayCount:
        current.selectedMovies.length === 0 ? 1 : current.displayCount,
    }));
  };

  const handleRemove = (movieId) => {
    clearMessages();
    setConfigState((current) => {
      const selectedMovies = current.selectedMovies.filter(
        (movie) => movie.id !== movieId,
      );
      return {
        ...current,
        selectedMovies,
        displayCount: clampDisplayCount(
          current.displayCount,
          selectedMovies.length,
        ),
      };
    });
  };

  const handleMove = (index, direction) => {
    clearMessages();
    setConfigState((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.selectedMovies.length) {
        return current;
      }

      const selectedMovies = [...current.selectedMovies];
      [selectedMovies[index], selectedMovies[nextIndex]] = [
        selectedMovies[nextIndex],
        selectedMovies[index],
      ];
      return { ...current, selectedMovies };
    });
  };

  const handleSave = async () => {
    if (
      validationMessage ||
      !isDirty ||
      saveState.status === "loading"
    ) {
      return;
    }

    setSelectionMessage("");
    setSaveState({ status: "loading", message: "" });

    try {
      const config = await updateHomepageConfig({
        movieIds: selectedIds,
        displayCount: configState.displayCount,
      });
      const restored = restoreConfiguredMovies(config);
      setConfigState((current) => ({
        ...current,
        configured: true,
        selectedMovies: restored.movies,
        displayCount: clampDisplayCount(
          config.displayCount,
          restored.movies.length,
        ),
        savedMovieIds: config.movieIds,
        savedDisplayCount: config.displayCount,
        missingCount: restored.missingCount,
      }));
      setSaveState({
        status: "success",
        message: "Homepage movie selection saved.",
      });
    } catch (error) {
      setSaveState({
        status: "error",
        message: getRequestMessage(error),
      });
    }
  };

  return (
    <section
      className="panel-surface mt-8 rounded-lg p-4 sm:p-6 lg:p-8"
      aria-labelledby="homepage-movies-title"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="page-eyebrow">Homepage curation</p>
          <h2
            id="homepage-movies-title"
            className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
          >
            Homepage movies
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            Select up to ten movies, arrange their display order, and choose how
            many appear in the homepage hero.
          </p>
        </div>
        {configState.status === "success" ? (
          <Badge tone={isDirty ? "warning" : "success"}>
            {isDirty ? "Unsaved changes" : "Saved"}
          </Badge>
        ) : null}
      </div>

      {configState.status === "loading" ? (
        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      ) : null}

      {configState.status === "error" ? (
        <div className="mt-7">
          <ErrorState
            title="Homepage configuration could not load"
            message={configState.error}
            onRetry={retryConfig}
          />
        </div>
      ) : null}

      {configState.status === "success" ? (
        <>
          {!configState.configured ? (
            <Alert tone="info" className="mt-6">
              This selection reflects the current automatic homepage. Save it
              to create an explicit configuration.
            </Alert>
          ) : null}
          {configState.missingCount > 0 ? (
            <Alert tone="warning" className="mt-6">
              {configState.missingCount} configured{" "}
              {configState.missingCount === 1 ? "movie is" : "movies are"} no
              longer available. Review and save the selection to remove stale
              entries.
            </Alert>
          ) : null}

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-lg border border-border/80 bg-background-elevated/45 p-4 sm:p-5">
              <div>
                <h3 className="text-lg font-semibold">Available movies</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Search the catalogue and add movies to the homepage.
                </p>
              </div>
              <form
                className="mt-5 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearch(searchInput.trim());
                  setPage(1);
                }}
              >
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-primary-hover"
                    aria-hidden="true"
                  />
                  <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search movie titles"
                    aria-label="Search available homepage movies"
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="secondary" className="shrink-0">
                  Search
                </Button>
              </form>

              <div className="mt-4">
                {availableStatus === "loading" ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 4 }, (_, index) => (
                      <Skeleton key={index} className="h-20" />
                    ))}
                  </div>
                ) : null}
                {availableStatus === "error" ? (
                  <ErrorState
                    title="Available movies could not load"
                    message={availableState.error}
                    onRetry={retryAvailable}
                  />
                ) : null}
                {availableStatus === "success" &&
                !availableState.movies.length ? (
                  <EmptyState
                    title={search ? "No movies match" : "No movies available"}
                    message={
                      search
                        ? "Try a different title or clear the current search."
                        : "Add movies to the catalogue before configuring the homepage."
                    }
                    action={
                      search ? (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSearchInput("");
                            setSearch("");
                            setPage(1);
                          }}
                        >
                          Clear search
                        </Button>
                      ) : null
                    }
                  />
                ) : null}
                {availableStatus === "success" &&
                availableState.movies.length ? (
                  <div className="grid gap-3">
                    {availableState.movies.map((movie) => (
                      <AvailableMovie
                        key={movie.id}
                        movie={movie}
                        isSelected={selectedIdSet.has(movie.id)}
                        selectionIsFull={
                          selectedIds.length >= MAX_SELECTED_MOVIES
                        }
                        onAdd={handleAdd}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              {availableStatus === "success" ? (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={availableState.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-border/80 bg-background-elevated/45 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Selected order</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    The first movie is featured first.
                  </p>
                </div>
                <Badge
                  tone={
                    selectedIds.length === MAX_SELECTED_MOVIES
                      ? "warning"
                      : "neutral"
                  }
                >
                  {selectedIds.length} / {MAX_SELECTED_MOVIES}
                </Badge>
              </div>

              {selectionMessage ? (
                <Alert tone="warning" className="mt-4">
                  {selectionMessage}
                </Alert>
              ) : null}

              {configState.selectedMovies.length ? (
                <ol className="mt-5 grid gap-3">
                  {configState.selectedMovies.map((movie, index) => (
                    <SelectedMovie
                      key={movie.id}
                      movie={movie}
                      index={index}
                      isVisible={index < configState.displayCount}
                      isFirst={index === 0}
                      isLast={
                        index === configState.selectedMovies.length - 1
                      }
                      onMove={handleMove}
                      onRemove={handleRemove}
                    />
                  ))}
                </ol>
              ) : (
                <div className="mt-5 rounded-md border border-dashed border-border px-5 py-10 text-center">
                  <p className="font-semibold">No homepage movies selected</p>
                  <p className="mt-2 text-sm text-text-muted">
                    Add at least one movie from the available catalogue.
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-border/75 pt-6">
                <label
                  htmlFor="homepage-display-count"
                  className="text-sm font-semibold"
                >
                  Visible movie count
                </label>
                <p className="mt-1 text-sm text-text-muted">
                  Only the first selected movies up to this count are shown.
                </p>
                <Select
                  id="homepage-display-count"
                  className="mt-3"
                  value={configState.displayCount}
                  disabled={!selectedIds.length}
                  invalid={Boolean(validationMessage && selectedIds.length)}
                  onChange={(event) => {
                    clearMessages();
                    setConfigState((current) => ({
                      ...current,
                      displayCount: Number(event.target.value),
                    }));
                  }}
                >
                  {!selectedIds.length ? (
                    <option value={0}>Select movies first</option>
                  ) : (
                    selectedIds.map((movieId, index) => (
                      <option key={movieId} value={index + 1}>
                        {index + 1}
                      </option>
                    ))
                  )}
                </Select>

                {validationMessage ? (
                  <p className="mt-3 text-sm text-danger" role="alert">
                    {validationMessage}
                  </p>
                ) : null}
                {saveState.status === "success" ? (
                  <Alert tone="success" className="mt-4">
                    {saveState.message}
                  </Alert>
                ) : null}
                {saveState.status === "error" ? (
                  <Alert tone="error" className="mt-4">
                    {saveState.message}
                  </Alert>
                ) : null}

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-text-subtle" aria-live="polite">
                    {isDirty
                      ? "Changes are not live until saved."
                      : "The saved order is live on the homepage."}
                  </p>
                  <Button
                    isLoading={saveState.status === "loading"}
                    disabled={Boolean(validationMessage) || !isDirty}
                    onClick={handleSave}
                  >
                    Save homepage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
