import { ApiError, apiRequest } from "./client";
import { normalizeMovie } from "./moviesApi";

function normalizeMovies(value) {
  return Array.isArray(value)
    ? value.map(normalizeMovie).filter(Boolean)
    : null;
}

function normalizeDisplayCount(value) {
  const displayCount = Number(value);
  return Number.isInteger(displayCount) ? displayCount : null;
}

function normalizeHomepage(data) {
  const movies = normalizeMovies(data?.movies);
  const displayCount = normalizeDisplayCount(data?.displayCount);

  if (!movies || displayCount === null) {
    throw new ApiError({
      message: "The homepage response was incomplete. Please try again.",
    });
  }

  return { displayCount, movies };
}

function normalizeHomepageConfig(data) {
  const movies = normalizeMovies(data?.movies);
  const displayCount = normalizeDisplayCount(data?.displayCount);

  if (!Array.isArray(data?.movieIds) || !movies || displayCount === null) {
    throw new ApiError({
      message: "The homepage configuration response was incomplete.",
    });
  }

  return {
    configured: data.configured === true,
    movieIds: data.movieIds.map(String),
    displayCount,
    movies,
  };
}

export async function getHomepage({ signal } = {}) {
  const data = await apiRequest("/homepage", {
    auth: false,
    signal,
  });
  return normalizeHomepage(data);
}

export async function getHomepageConfig({ signal } = {}) {
  const data = await apiRequest("/homepage/config", { signal });
  return normalizeHomepageConfig(data);
}

export async function updateHomepageConfig(
  { movieIds, displayCount },
  { signal } = {},
) {
  const data = await apiRequest("/homepage/config", {
    method: "PUT",
    body: { movieIds, displayCount },
    signal,
  });
  return normalizeHomepageConfig(data);
}
