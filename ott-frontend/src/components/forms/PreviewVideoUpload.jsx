import { useId, useRef, useState } from "react";
import { FileVideo, Replace, Trash2 } from "lucide-react";
import {
  formatFileSize,
  getPreviewVideoUrl,
  validatePreviewVideoFile,
} from "../../utils/previewVideo";
import { MoviePlayer } from "../movies/MoviePlayer";
import { Button } from "../ui/Button";

export function PreviewVideoUpload({
  movie,
  optional = false,
  onFileChange,
  error,
  disabled = false,
}) {
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const currentVideoUrl = getPreviewVideoUrl(movie?.previewVideoUrl);

  const setFile = (file) => {
    if (disabled) {
      return;
    }

    if (!file) {
      setSelectedFile(null);
      setLocalError("");
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const validationMessage = validatePreviewVideoFile(file);
    if (validationMessage) {
      setSelectedFile(null);
      setLocalError(validationMessage);
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setLocalError("");
    onFileChange(file);
  };

  return (
    <section aria-labelledby={`${inputId}-heading`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={`${inputId}-heading`} className="text-xl font-semibold">
            Movie video{" "}
            {optional ? (
              <span className="text-sm font-normal text-text-subtle">
                (optional)
              </span>
            ) : null}
          </h2>
          <p id={helpId} className="mt-1 text-sm text-text-muted">
            MP4 only, up to 200 MB. The video is uploaded without browser-side
            processing.
          </p>
        </div>
        <Button
          variant="secondary"
          className="w-full shrink-0 sm:w-auto"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {selectedFile ? (
            <Replace className="size-4" aria-hidden="true" />
          ) : (
            <FileVideo className="size-4" aria-hidden="true" />
          )}
          {selectedFile ? "Choose another video" : "Choose video"}
        </Button>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="video/mp4,.mp4"
        className="sr-only"
        disabled={disabled}
        aria-describedby={helpId}
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />

      {movie ? (
        currentVideoUrl ? (
          <div className="mt-5 rounded-md border border-border/80 bg-surface/55 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-md border border-primary/35 bg-primary-soft text-primary-hover">
                  <FileVideo className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">Current video</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Ready to play with sound.
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full shrink-0 sm:w-auto"
                disabled={disabled}
                aria-expanded={isPlayerOpen}
                aria-controls={`${inputId}-current-player`}
                onClick={() => setIsPlayerOpen((value) => !value)}
              >
                {isPlayerOpen ? "Hide video" : "Play video"}
              </Button>
            </div>
            {isPlayerOpen ? (
              <div id={`${inputId}-current-player`} className="mt-4">
                <MoviePlayer movie={movie} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 rounded-md border border-dashed border-border-strong bg-background-elevated/45 px-4 py-6 text-center">
            <FileVideo
              className="mx-auto size-6 text-text-subtle"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold">No video available</p>
            <p className="mt-1 text-sm text-text-muted">
              A playable movie is not currently available for this title.
            </p>
          </div>
        )
      ) : null}

      {selectedFile ? (
        <div className="mt-4 rounded-md border border-primary/40 bg-primary-soft/25 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <FileVideo
              className="mt-0.5 size-5 shrink-0 text-primary-hover"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-semibold">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              className="min-h-10 shrink-0 px-3"
              disabled={disabled}
              onClick={() => setFile(null)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Clear selection
            </Button>
          </div>
        </div>
      ) : null}

      {localError || error ? (
        <p className="mt-2 text-sm text-danger" role="alert">
          {localError || error}
        </p>
      ) : null}
    </section>
  );
}
