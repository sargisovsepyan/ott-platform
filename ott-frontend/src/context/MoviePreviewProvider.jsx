import { useCallback, useMemo, useRef, useState } from "react";
import { MoviePreviewModal } from "../components/movies/MoviePreviewModal";
import { getPreviewVideoUrl } from "../utils/previewVideo";
import { MoviePreviewContext } from "./moviePreviewContext";

export function MoviePreviewProvider({ children }) {
  const [activePreview, setActivePreview] = useState(null);
  const sessionRef = useRef(0);

  const openPreview = useCallback((movie, returnFocusElement) => {
    const previewVideoUrl = getPreviewVideoUrl(movie?.previewVideoUrl);
    if (!previewVideoUrl) {
      return false;
    }

    sessionRef.current += 1;
    setActivePreview({
      id: movie.id,
      title: movie.title?.trim() || "Movie preview",
      previewVideoUrl,
      sessionId: sessionRef.current,
      returnFocusElement:
        returnFocusElement instanceof HTMLElement
          ? returnFocusElement
          : document.activeElement,
    });
    return true;
  }, []);

  const closePreview = useCallback(() => setActivePreview(null), []);
  const value = useMemo(
    () => ({
      activePreview,
      openPreview,
      closePreview,
    }),
    [activePreview, closePreview, openPreview],
  );

  return (
    <MoviePreviewContext.Provider value={value}>
      {children}
      <MoviePreviewModal
        key={activePreview?.sessionId ?? "closed"}
        preview={activePreview}
        onClose={closePreview}
      />
    </MoviePreviewContext.Provider>
  );
}
