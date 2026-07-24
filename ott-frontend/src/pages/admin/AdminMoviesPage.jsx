import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
      className="flex w-full max-w-lg gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movie titles"
        aria-label="Search managed movies"
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}

function AdminMovieActions({ movie, onDelete }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/admin/movies/${movie.id}/edit`}
        className={buttonClassName("secondary")}
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit
      </Link>
      <Button variant="danger" onClick={() => onDelete(movie)}>
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
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
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
            Administration
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em]">
            Movie management
          </h1>
          <p className="mt-3 text-text-muted" aria-live="polite">
            {displayStatus === "success"
              ? `${state.total} ${state.total === 1 ? "movie" : "movies"}`
              : "Loading catalogue"}
          </p>
        </div>
        <Link to="/admin/movies/new" className={buttonClassName("primary")}>
          <Plus className="size-4" aria-hidden="true" />
          Add movie
        </Link>
      </div>
      {location.state?.message ? (
        <Alert tone="success" className="mt-6">
          {location.state.message}
        </Alert>
      ) : null}
      <div className="mt-8">
        <AdminSearch
          key={search}
          initialValue={search}
          onSubmit={(value) => setQuery({ search: value, page: 1 })}
        />
      </div>
      <div className="mt-8">
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
            <div className="hidden overflow-x-auto rounded-md border border-border lg:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-surface text-xs uppercase tracking-[0.06em] text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Movie</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Genre</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.movies.map((movie) => (
                    <tr key={movie.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <PosterImage
                            src={movie.poster}
                            title={movie.title}
                            className="w-12 shrink-0"
                          />
                          <span className="font-semibold">{movie.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{movie.year}</td>
                      <td className="px-4 py-3 text-text-muted">{movie.genre}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {movie.rating.toFixed(1)}
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
                  className="grid grid-cols-[5rem_1fr] gap-4 rounded-md border border-border bg-surface p-4"
                >
                  <PosterImage
                    src={movie.poster}
                    title={movie.title}
                    className="w-20"
                  />
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{movie.title}</h2>
                    <p className="mt-2 text-sm text-text-muted">
                      {movie.year} • {movie.genre} • {movie.rating.toFixed(1)}/10
                    </p>
                    <div className="mt-4">
                      <AdminMovieActions movie={movie} onDelete={setSelectedMovie} />
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
