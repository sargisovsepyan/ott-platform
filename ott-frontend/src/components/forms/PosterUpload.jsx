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
  movieTitle = "movie",
  required = false,
  onFileChange,
  error,
}) {
  const inputRef = useRef(null);
  const objectUrlRef = useRef("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

  const setFile = (file) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      setLocalError("");
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    if (!acceptedTypes.has(file.type)) {
      setSelectedFile(null);
      setPreviewUrl("");
      setLocalError("Choose a JPG, JPEG, PNG, or WebP image.");
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setLocalError("");
    onFileChange(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <section aria-labelledby="poster-upload-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="poster-upload-heading" className="text-xl font-semibold">
            Poster {required ? <span className="text-danger">*</span> : null}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            JPG, JPEG, PNG, or WebP. The backend defines no file-size limit.
          </p>
        </div>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
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
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        aria-describedby="poster-upload-help"
      />
      <div
        className={[
          "mt-4 rounded-md border bg-surface p-4 transition-colors duration-[140ms] ease-out",
          isDragging ? "border-primary bg-primary-soft" : "border-border",
        ].join(" ")}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {previewUrl || currentPoster ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {currentPoster ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-text-muted">Current</p>
                <PosterImage
                  src={currentPoster}
                  title={movieTitle}
                  className="max-w-60"
                />
              </div>
            ) : null}
            {previewUrl ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-text-muted">Selected</p>
                <PosterImage
                  src={previewUrl}
                  title={`${movieTitle} preview`}
                  className="max-w-60"
                />
                <p className="mt-3 break-all text-sm font-medium">{selectedFile.name}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {formatFileSize(selectedFile.size)}
                </p>
                <Button variant="ghost" className="mt-2" onClick={() => setFile(null)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="grid min-h-52 w-full place-items-center rounded-sm border border-dashed border-border-strong px-5 text-center text-text-muted hover:border-primary hover:text-text"
            onClick={() => inputRef.current?.click()}
          >
            <span>
              <ImagePlus className="mx-auto size-8" aria-hidden="true" />
              <span className="mt-3 block font-semibold">Choose or drop a poster</span>
              <span id="poster-upload-help" className="mt-1 block text-sm">
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
