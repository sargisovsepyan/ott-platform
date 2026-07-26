import { ApiError, apiRequest } from "./client";

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeMovie(movie) {
  if (!movie || typeof movie !== "object") {
    return null;
  }

  const id = movie._id ?? movie.id;
  if (!id || typeof movie.title !== "string") {
    return null;
  }

  return {
    id: String(id),
    title: movie.title,
    year: normalizeNumber(movie.year),
    genre: typeof movie.genre === "string" ? movie.genre : "",
    description: typeof movie.description === "string" ? movie.description : "",
    rating: normalizeNumber(movie.rating),
    poster: typeof movie.poster === "string" ? movie.poster : "",
    videoUrl: typeof movie.videoUrl === "string" ? movie.videoUrl.trim() : "",
    createdAt: movie.createdAt ?? null,
    updatedAt: movie.updatedAt ?? null,
  };
}

export async function getMovies(params = {}, { signal } = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const data = await apiRequest(`/movies${query ? `?${query}` : ""}`, { signal });
  const movies = Array.isArray(data?.movies)
    ? data.movies.map(normalizeMovie).filter(Boolean)
    : [];

  if (!data || !Array.isArray(data.movies)) {
    throw new ApiError({
      message: "The catalogue response was incomplete. Please try again.",
    });
  }

  return {
    total: normalizeNumber(data.total),
    totalPages: normalizeNumber(data.totalPages),
    page: Math.max(1, normalizeNumber(data.page, 1)),
    limit: Math.max(1, normalizeNumber(data.limit, 10)),
    movies,
  };
}

export async function getMovie(id, { signal } = {}) {
  const data = await apiRequest(`/movies/${encodeURIComponent(id)}`, { signal });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({
      message: "The movie response was incomplete. Please try again.",
    });
  }

  return movie;
}

export async function getAllMovies(params = {}, { signal } = {}) {
  const query = { ...params };
  delete query.page;
  delete query.limit;

  const firstPage = await getMovies(
    { ...query, page: 1, limit: 100 },
    { signal },
  );
  const remainingPages =
    firstPage.totalPages > 1
      ? await Promise.all(
          Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
            getMovies(
              { ...query, page: index + 2, limit: 100 },
              { signal },
            ),
          ),
        )
      : [];

  return [
    ...firstPage.movies,
    ...remainingPages.flatMap((page) => page.movies),
  ];
}

export async function getMovieFilterOptions({ signal } = {}) {
  const movies = await getAllMovies({ sort: "-year" }, { signal });
  const years = [
    ...new Set(
      movies
        .map((movie) => movie.year)
        .filter((year) => Number.isInteger(year) && year > 0),
    ),
  ].sort((first, second) => second - first);
  const genresByKey = new Map();

  movies.forEach((movie) => {
    const genre = typeof movie.genre === "string" ? movie.genre.trim() : "";
    if (genre && !genresByKey.has(genre.toLocaleLowerCase())) {
      genresByKey.set(genre.toLocaleLowerCase(), genre);
    }
  });

  return {
    years,
    genres: [...genresByKey.values()].sort((first, second) =>
      first.localeCompare(second, undefined, { sensitivity: "base" }),
    ),
  };
}

export async function createMovie(formData, { signal } = {}) {
  const data = await apiRequest("/movies", {
    method: "POST",
    body: formData,
    signal,
  });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({ message: "The created movie response was incomplete." });
  }

  return movie;
}

export async function updateMovie(id, fields, { signal } = {}) {
  const data = await apiRequest(`/movies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: fields,
    signal,
  });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({ message: "The updated movie response was incomplete." });
  }

  return movie;
}

export async function updateMoviePoster(id, formData, { signal } = {}) {
  const data = await apiRequest(`/movies/${encodeURIComponent(id)}/poster`, {
    method: "PATCH",
    body: formData,
    signal,
  });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({ message: "The updated poster response was incomplete." });
  }

  return movie;
}

export async function updateMovieVideo(id, file, { signal } = {}) {
  const formData = new FormData();
  formData.append("video", file);
  const data = await apiRequest(`/movies/${encodeURIComponent(id)}/video`, {
    method: "PATCH",
    body: formData,
    signal,
  });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({
      message: "The updated movie video response was incomplete.",
    });
  }

  return movie;
}

export async function deleteMovieVideo(id, { signal } = {}) {
  const data = await apiRequest(`/movies/${encodeURIComponent(id)}/video`, {
    method: "DELETE",
    signal,
  });
  const movie = normalizeMovie(data);

  if (!movie) {
    throw new ApiError({
      message: "The updated movie video response was incomplete.",
    });
  }

  return movie;
}

export function deleteMovie(id, { signal } = {}) {
  return apiRequest(`/movies/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal,
  });
}
