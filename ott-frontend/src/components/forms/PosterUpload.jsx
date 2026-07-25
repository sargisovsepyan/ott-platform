import { useEffect, useRef, useState } from "react";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { PosterImage } from "../movies/PosterImage";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PosterUpload({
  currentPoster,
  currentPosterVersion,
  movieTitle = "movie",
  required = false,
  onFileChange,
  error,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const selectedFile = selection?.file ?? null;
  const previewUrl = selection?.url ?? "";

  useEffect(() => {
    const objectUrl = selection?.url;
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selection]);

  const setFile = (file) => {
    if (disabled) {
      return;
    }

    if (!file) {
      setSelection(null);
      setLocalError("");
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    if (!acceptedTypes.has(file.type)) {
      setSelection(null);
      setLocalError("Choose a JPG, JPEG, PNG, or WebP image.");
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelection({ file, url: objectUrl });
    setLocalError("");
    onFileChange(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) {
      return;
    }
    setFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <section aria-labelledby="poster-upload-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="poster-upload-heading" className="text-xl font-semibold">
            Poster {required ? <span className="text-danger">*</span> : null}
          </h2>
          <p id="poster-upload-help" className="mt-1 text-sm text-text-muted">
            JPG, JPEG, PNG, or WebP. No maximum file size is configured.
          </p>
        </div>
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {selectedFile ? (
            <Replace className="size-4" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-4" aria-hidden="true" />
          )}
          {selectedFile ? "Replace" : "Choose poster"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        aria-describedby="poster-upload-help"
      />
      <div
        className={[
          "mt-5 rounded-lg border bg-surface/55 p-4 transition-[background-color,border-color,box-shadow] duration-[140ms] ease-out sm:p-5",
          isDragging
            ? "border-primary bg-primary-soft/60 shadow-glow"
            : "border-border/80",
        ].join(" ")}
        aria-disabled={disabled || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        {previewUrl || currentPoster ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {currentPoster ? (
              <div className="rounded-md border border-border/70 bg-background-elevated/70 p-4">
                <p className="mb-3 text-sm font-semibold text-text-muted">
                  Current poster
                </p>
                <PosterImage
                  src={currentPoster}
                  version={currentPosterVersion}
                  title={movieTitle}
                  className="mx-auto max-w-56 rounded-md shadow-card"
                />
              </div>
            ) : null}
            {previewUrl ? (
              <div className="rounded-md border border-primary/35 bg-primary-soft/25 p-4">
                <p className="mb-3 text-sm font-semibold text-text">
                  Proposed poster
                </p>
                <PosterImage
                  src={previewUrl}
                  title={`${movieTitle} preview`}
                  className="mx-auto max-w-56 rounded-md shadow-card"
                />
                <p className="mt-3 break-all text-sm font-medium">{selectedFile.name}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {formatFileSize(selectedFile.size)}
                </p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  disabled={disabled}
                  onClick={() => setFile(null)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="grid min-h-64 w-full place-items-center rounded-md border border-dashed border-border-strong bg-background-elevated/45 px-5 text-center text-text-muted transition-[background-color,border-color,color] duration-[140ms] ease-out hover:border-primary hover:bg-primary-soft/25 hover:text-text"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <span>
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/35 bg-primary-soft text-primary-hover">
                <ImagePlus className="size-6" aria-hidden="true" />
              </span>
              <span className="mt-4 block font-semibold">Choose or drop a poster</span>
              <span className="mt-2 block text-sm">
                The image will be cropped to a stable 2:3 frame without stretching.
              </span>
            </span>
          </button>
        )}
      </div>
      {localError || error ? (
        <p className="mt-2 text-sm text-danger" role="alert">
          {localError || error}
        </p>
      ) : null}
    </section>
  );
}
