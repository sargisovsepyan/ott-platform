import { useContext } from "react";
import { MoviePreviewContext } from "../context/moviePreviewContext";

export function useMoviePreview() {
  const context = useContext(MoviePreviewContext);
  if (!context) {
    throw new Error("useMoviePreview must be used within MoviePreviewProvider");
  }

  return context;
}
