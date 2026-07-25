import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";
import {
  getSavedScrollPosition,
  getScrollIntent,
  saveScrollPosition,
  scrollToPageTop,
  scrollToPosition,
  scrollToSection,
} from "../../utils/scrollNavigation";

const RESTORE_DELAYS = [0, 120, 360, 800];

export function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocationRef = useRef(location);

  useEffect(() => {
    const recordPosition = () =>
      saveScrollPosition(location.key, window.scrollY);

    recordPosition();
    window.addEventListener("scroll", recordPosition, { passive: true });
    return () => {
      recordPosition();
      window.removeEventListener("scroll", recordPosition);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    const previousLocation = previousLocationRef.current;
    previousLocationRef.current = location;

    if (navigationType === "POP") {
      return undefined;
    }

    let intent = getScrollIntent(location.state);
    if (
      !intent &&
      location.pathname === "/movies" &&
      previousLocation.pathname === location.pathname &&
      previousLocation.search !== location.search
    ) {
      intent = {
        type: "position",
        position:
          getSavedScrollPosition(previousLocation.key) ?? window.scrollY,
      };
    }

    if (!intent) {
      return undefined;
    }

    if (intent.type === "top") {
      const frame = window.requestAnimationFrame(scrollToPageTop);
      return () => window.cancelAnimationFrame(frame);
    }

    if (intent.type === "section") {
      const frame = window.requestAnimationFrame(() =>
        scrollToSection(intent.sectionId),
      );
      return () => window.cancelAnimationFrame(frame);
    }

    const savedPosition =
      intent.type === "position"
        ? intent.position
        : getSavedScrollPosition(intent.locationKey);
    if (savedPosition === null) {
      const frame = window.requestAnimationFrame(scrollToPageTop);
      return () => window.cancelAnimationFrame(frame);
    }

    let cancelled = false;
    const restore = () => {
      if (!cancelled) {
        scrollToPosition(savedPosition);
      }
    };
    const cancelRestore = () => {
      cancelled = true;
    };
    const timers = RESTORE_DELAYS.map((delay) =>
      window.setTimeout(restore, delay),
    );

    window.addEventListener("wheel", cancelRestore, { passive: true });
    window.addEventListener("touchstart", cancelRestore, { passive: true });
    window.addEventListener("pointerdown", cancelRestore, { passive: true });
    window.addEventListener("keydown", cancelRestore);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("wheel", cancelRestore);
      window.removeEventListener("touchstart", cancelRestore);
      window.removeEventListener("pointerdown", cancelRestore);
      window.removeEventListener("keydown", cancelRestore);
    };
  }, [location, navigationType]);

  return null;
}
