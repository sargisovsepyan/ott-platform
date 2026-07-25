const FALLBACK_ORIGIN = {
  pathname: "/movies",
  search: "",
  label: "Back to catalogue",
};
const ORIGIN_SESSION_ID = `${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;

function getDefaultLabel(pathname) {
  if (pathname === "/") {
    return "Back to Home";
  }

  if (pathname === "/movies") {
    return "Back to catalogue";
  }

  if (pathname.startsWith("/movies/")) {
    return "Back to movie details";
  }

  if (pathname.startsWith("/admin/movies")) {
    return "Back to movie management";
  }

  return "Back to previous page";
}

export function normalizeMovieOrigin(value) {
  if (
    !value ||
    typeof value !== "object" ||
    typeof value.pathname !== "string" ||
    !value.pathname.startsWith("/") ||
    value.pathname.startsWith("//") ||
    value.pathname.includes("\\")
  ) {
    return null;
  }

  try {
    const search =
      typeof value.search === "string" && value.search
        ? value.search.startsWith("?")
          ? value.search
          : `?${value.search}`
        : "";
    const url = new URL(`${value.pathname}${search}`, "https://lumio.local");
    const label =
      typeof value.label === "string" && value.label.trim()
        ? value.label.trim().slice(0, 80)
        : getDefaultLabel(url.pathname);

    return {
      pathname: url.pathname,
      search: url.search,
      label,
    };
  } catch {
    return null;
  }
}

export function createMovieOrigin(location, label) {
  return (
    normalizeMovieOrigin({
      pathname: location.pathname,
      search: location.search,
      label: label || getDefaultLabel(location.pathname),
    }) ?? FALLBACK_ORIGIN
  );
}

export function createMovieDetailState(location, label) {
  return createTopScrollState({
    origin: createMovieOrigin(location, label),
    originSessionId: ORIGIN_SESSION_ID,
    originLocationKey:
      typeof location.key === "string" && location.key ? location.key : "",
  });
}

export function getMovieReturnOrigin(locationState) {
  if (locationState?.originSessionId !== ORIGIN_SESSION_ID) {
    return { ...FALLBACK_ORIGIN, locationKey: "" };
  }

  const origin = normalizeMovieOrigin(locationState?.origin);
  if (!origin) {
    return { ...FALLBACK_ORIGIN, locationKey: "" };
  }

  return {
    ...origin,
    locationKey:
      typeof locationState.originLocationKey === "string"
        ? locationState.originLocationKey
        : "",
  };
}

export function getMovieOriginHref(origin) {
  return `${origin.pathname}${origin.search}`;
}
import { createTopScrollState } from "./scrollNavigation";
