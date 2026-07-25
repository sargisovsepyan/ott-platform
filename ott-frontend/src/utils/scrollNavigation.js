export const MEMBERSHIP_SECTION_ID = "plans";
export const CATALOGUE_RESULTS_ID = "catalogue-results";

const MAX_SAVED_POSITIONS = 60;
const savedScrollPositions = new Map();

export const TOP_SCROLL_STATE = Object.freeze({
  scrollIntent: Object.freeze({ type: "top" }),
});
export function createTopScrollState(state = {}) {
  return {
    ...state,
    scrollIntent: { type: "top" },
  };
}

export function createSectionScrollState(sectionId, state = {}) {
  return {
    ...state,
    scrollIntent: { type: "section", sectionId },
  };
}

export function createRestoreScrollState(locationKey, state = {}) {
  if (typeof locationKey !== "string" || !locationKey) {
    return createTopScrollState(state);
  }

  return {
    ...state,
    scrollIntent: { type: "restore", locationKey },
  };
}

export function createPositionScrollState(position, state = {}) {
  return {
    ...state,
    scrollIntent: {
      type: "position",
      position: Number.isFinite(position) ? Math.max(0, position) : 0,
    },
  };
}

export function getScrollIntent(locationState) {
  const intent = locationState?.scrollIntent;
  if (!intent || typeof intent !== "object") {
    return null;
  }

  if (intent.type === "top") {
    return { type: "top" };
  }

  if (intent.type === "position" && Number.isFinite(intent.position)) {
    return { type: "position", position: Math.max(0, intent.position) };
  }

  if (
    intent.type === "section" &&
    typeof intent.sectionId === "string" &&
    intent.sectionId
  ) {
    return { type: "section", sectionId: intent.sectionId };
  }

  if (
    intent.type === "restore" &&
    typeof intent.locationKey === "string" &&
    intent.locationKey
  ) {
    return { type: "restore", locationKey: intent.locationKey };
  }

  return null;
}

export function saveScrollPosition(locationKey, position) {
  if (
    typeof locationKey !== "string" ||
    !locationKey ||
    !Number.isFinite(position)
  ) {
    return;
  }

  savedScrollPositions.delete(locationKey);
  savedScrollPositions.set(locationKey, Math.max(0, position));

  while (savedScrollPositions.size > MAX_SAVED_POSITIONS) {
    const oldestKey = savedScrollPositions.keys().next().value;
    savedScrollPositions.delete(oldestKey);
  }
}

export function getSavedScrollPosition(locationKey) {
  return savedScrollPositions.get(locationKey) ?? null;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToPosition(position) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({
    top: Number.isFinite(position) ? Math.max(0, position) : 0,
    left: 0,
    behavior: "auto",
  });
  root.style.scrollBehavior = previousScrollBehavior;
}

export function scrollToPageTop() {
  scrollToPosition(0);
}

export function scrollToSection(sectionId, { behavior = "smooth" } = {}) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return false;
  }

  section.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : behavior,
    block: "start",
  });
  return true;
}

export function scrollToMembershipSection() {
  return scrollToSection(MEMBERSHIP_SECTION_ID);
}
