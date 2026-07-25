import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CircleAlert,
  LoaderCircle,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

function resetVideo(video, unload = false) {
  if (!video) {
    return;
  }

  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // Media may not have established a seekable timeline yet.
  }

  if (unload) {
    video.removeAttribute("src");
    video.load();
  }
}

export function MoviePreviewModal({ preview, onClose }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const videoRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [playbackState, setPlaybackState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const requestClose = useCallback(() => {
    resetVideo(videoRef.current, true);
    onCloseRef.current();
  }, []);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setPlaybackState("loading");
    setErrorMessage("");
    try {
      video.currentTime = 0;
    } catch {
      // The player will still begin from zero when its metadata becomes ready.
    }

    const playback = video.play();
    if (playback?.catch) {
      playback.catch(() => {
        setPlaybackState("error");
        setErrorMessage(
          "The preview could not start. Check your connection and try again.",
        );
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (!preview) {
      return undefined;
    }

    const video = videoRef.current;
    const playback = video?.play();
    if (playback?.catch) {
      playback.catch(() => {
        setPlaybackState("error");
        setErrorMessage(
          "The preview could not start. Check your connection and try again.",
        );
      });
    }

    return () => {
      resetVideo(video);
    };
  }, [preview]);

  useEffect(() => {
    if (!preview) {
      return undefined;
    }

    const previouslyFocused =
      preview.returnFocusElement ?? document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [preview, requestClose]);

  if (!preview) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-overlay px-3 py-4 sm:px-6 sm:py-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="panel-surface max-h-[calc(100svh-2rem)] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-lg p-3 sm:p-5"
      >
        <header className="flex items-start justify-between gap-4 px-1 pb-3 sm:px-2 sm:pb-4">
          <div className="min-w-0">
            <p className="page-eyebrow">Lumio preview</p>
            <h2
              id={titleId}
              className="mt-1 truncate text-xl font-semibold sm:text-2xl"
            >
              {preview.title}
            </h2>
            <p id={descriptionId} className="sr-only">
              Movie preview player with sound and playback controls.
            </p>
          </div>
          <IconButton
            ref={closeButtonRef}
            label={`Close preview for ${preview.title}`}
            onClick={requestClose}
          >
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </header>

        <div className="relative aspect-video overflow-hidden rounded-md border border-border-strong bg-black">
          <video
            key={preview.sessionId}
            ref={videoRef}
            src={preview.previewVideoUrl}
            className="size-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            onLoadStart={() => setPlaybackState("loading")}
            onWaiting={() => setPlaybackState("loading")}
            onPlaying={() => {
              setPlaybackState("playing");
              setErrorMessage("");
            }}
            onEnded={() => setPlaybackState("ended")}
            onError={() => {
              setPlaybackState("error");
              setErrorMessage(
                "This preview is currently unavailable. Try again later.",
              );
            }}
          >
            Your browser does not support HTML video.
          </video>

          {playbackState === "loading" ? (
            <div
              className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55"
              role="status"
              aria-live="polite"
            >
              <span className="flex items-center gap-3 rounded-md border border-border bg-background-elevated/95 px-4 py-3 text-sm font-semibold">
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />
                Preparing preview
              </span>
            </div>
          ) : null}

          {playbackState === "ended" ? (
            <div className="absolute inset-0 grid place-items-center bg-black/78 px-5 text-center">
              <div>
                <p className="text-xl font-semibold">Preview ended</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={startPlayback}>
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Replay
                  </Button>
                  <Button variant="secondary" onClick={requestClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {playbackState === "error" ? (
            <div className="absolute inset-0 grid place-items-center bg-black/88 px-5 text-center">
              <div className="max-w-md">
                <CircleAlert
                  className="mx-auto size-8 text-warning"
                  aria-hidden="true"
                />
                <p className="mt-3 text-lg font-semibold">Preview unavailable</p>
                <p className="mt-2 text-sm text-text-muted">{errorMessage}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={startPlayback}>
                    <Play className="size-4" aria-hidden="true" />
                    Try again
                  </Button>
                  <Button variant="secondary" onClick={requestClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>,
    document.body,
  );
}
