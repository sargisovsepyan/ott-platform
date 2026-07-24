import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { deleteMovie, getMovies } from "../../api/moviesApi";
import { Alert } from "../../components/feedback/Alert";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { Pagination } from "../../components/movies/Pagination";
import { PosterImage } from "../../components/movies/PosterImage";
import { Button } from "../../components/ui/Button";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { Input } from "../../components/ui/Input";

function AdminSearch({ initialValue, onSubmit }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-primary-hover"
          aria-hidden="true"
        />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search movie titles"
          aria-label="Search managed movies"
          className="pl-10"
        />
      </div>
      <Button type="submit" variant="secondary" className="shrink-0">
        Search
      </Button>
    </form>
  );
}

function AdminMovieActions({ movie, onDelete, fullWidth = false }) {
  return (
    <div className={["flex flex-wrap gap-2", fullWidth ? "w-full" : ""].join(" ")}>
      <Link
        to={`/admin/movies/${movie.id}/edit`}
        className={buttonClassName(
          "secondary",
          fullWidth ? "min-h-10 flex-1 px-3" : "min-h-10 px-3",
        )}
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit
      </Link>
      <Button
        variant="danger"
        className={fullWidth ? "min-h-10 flex-1 px-3" : "min-h-10 px-3"}
        onClick={() => onDelete(movie)}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
}

function formatUpdatedDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
}

export function AdminMoviesPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const pageValue = Number(searchParams.get("page"));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    queryKey: "",
    movies: [],
    total: 0,
    totalPages: 0,
    error: "",
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const retry = useCallback(() => setRequestKey((value) => value + 1), []);
  const queryKey = [search, page, requestKey].join("|");
  const displayStatus = state.queryKey === queryKey ? state.status : "loading";

  const setQuery = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const controller = new AbortController();
    getMovies(
      { search, page, limit: 10, sort: "-year" },
      { signal: controller.signal },
    )
      .then((data) => {
        if (data.totalPages > 0 && page > data.totalPages) {
          setQuery({ page: data.totalPages });
          return;
        }
        setState({
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
          setState((current) => ({
            ...current,
            status: "error",
            queryKey,
            error: error.message,
          }));
        }
      });
    return () => controller.abort();
  }, [page, requestKey, search, setQuery, queryKey]);

  const handleDelete = async () => {
    if (!selectedMovie) {
      return;
    }
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteMovie(selectedMovie.id);
      setSelectedMovie(null);
      if (state.movies.length === 1 && page > 1) {
        setQuery({ page: page - 1 });
      } else {
        retry();
      }
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer className="page-section">
      <header className="admin-intro flex flex-col gap-6 rounded-lg px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <p className="page-eyebrow">Lumio administration</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Movie management
          </h1>
          <p className="mt-3 text-text-muted" aria-live="polite">
            {displayStatus === "success"
              ? `${state.total} ${state.total === 1 ? "movie" : "movies"}`
              : "Loading catalogue"}
          </p>
        </div>
        <Link
          to="/admin/movies/new"
          className={buttonClassName("primary", "w-full sm:w-auto")}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add movie
        </Link>
      </header>
      {location.state?.message ? (
        <Alert tone="success" className="mt-6">
          {location.state.message}
        </Alert>
      ) : null}
      <div className="panel-surface mt-8 rounded-lg p-4 sm:p-5">
        <AdminSearch
          key={search}
          initialValue={search}
          onSubmit={(value) => setQuery({ search: value, page: 1 })}
        />
      </div>
      <div className="mt-6">
        {displayStatus === "loading" ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
        ) : null}
        {displayStatus === "error" ? (
          <ErrorState
            title="Movie management could not load"
            message={state.error}
            onRetry={retry}
          />
        ) : null}
        {displayStatus === "success" && !state.movies.length ? (
          <EmptyState
            title={search ? "No managed movies match" : "No movies yet"}
            message={
              search
                ? "Try a different title or clear the current search."
                : "Add the first movie to begin building the catalogue."
            }
            action={
              search ? (
                <Button variant="secondary" onClick={() => setQuery({ search: "", page: 1 })}>
                  Clear search
                </Button>
              ) : (
                <Link to="/admin/movies/new" className={buttonClassName("primary")}>
                  Add movie
                </Link>
              )
            }
          />
        ) : null}
        {displayStatus === "success" && state.movies.length ? (
          <>
            <div className="panel-surface hidden overflow-x-auto rounded-lg lg:block">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <thead className="bg-background-elevated/90 text-xs uppercase tracking-[0.08em] text-text-subtle">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Movie</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Genre</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.movies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="border-t border-border/75 transition-colors duration-[180ms] hover:bg-surface-hover/55"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <PosterImage
                            src={movie.poster}
                            title={movie.title}
                            year={movie.year}
                            className="w-12 shrink-0 rounded-md"
                          />
                          <span className="font-semibold">{movie.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted tabular-nums">{movie.year}</td>
                      <td className="px-4 py-3 text-text-muted">{movie.genre}</td>
                      <td className="px-4 py-3 text-text-muted tabular-nums">
                        {movie.rating.toFixed(1)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-text-subtle">
                        {formatUpdatedDate(movie.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminMovieActions movie={movie} onDelete={setSelectedMovie} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 lg:hidden">
              {state.movies.map((movie) => (
                <article
                  key={movie.id}
                  className="panel-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-lg p-4 sm:p-5"
                >
                  <PosterImage
                    src={movie.poster}
                    title={movie.title}
                    year={movie.year}
                    className="w-20 rounded-md shadow-card"
                  />
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{movie.title}</h2>
                    <p className="mt-2 text-sm text-text-muted">
                      {movie.year} • {movie.genre} • {movie.rating.toFixed(1)}/10
                    </p>
                    <div className="mt-4">
                      <AdminMovieActions
                        movie={movie}
                        onDelete={setSelectedMovie}
                        fullWidth
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>
      {displayStatus === "success" ? (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={state.totalPages}
            onPageChange={(nextPage) => setQuery({ page: nextPage })}
          />
        </div>
      ) : null}
      <ConfirmDialog
        isOpen={Boolean(selectedMovie)}
        title="Delete movie?"
        message={
          selectedMovie
            ? `${selectedMovie.title} will be permanently removed from the catalogue.`
            : ""
        }
        confirmLabel="Delete movie"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) {
            setSelectedMovie(null);
            setDeleteError("");
          }
        }}
      />
    </PageContainer>
  );
}
