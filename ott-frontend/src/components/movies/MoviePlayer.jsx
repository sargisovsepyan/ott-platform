import { useCallback, useEffect, useRef, useState } from "react";
import {
  CircleAlert,
  LoaderCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import { getVideoUrl } from "../../utils/video";
import { Button } from "../ui/Button";

function stopVideo(video) {
  if (!video) {
    return;
  }

  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // A media timeline may not exist yet when navigation interrupts loading.
  }
}

export function MoviePlayer({ movie, className = "" }) {
  const videoRef = useRef(null);
  const attemptedSourceRef = useRef("");
  const source = getVideoUrl(movie?.videoUrl);
  const title = movie?.title?.trim() || "Movie";
  const [playback, setPlayback] = useState({
    source,
    status: "idle",
    message: "",
  });
  const playbackState =
    playback.source === source ? playback.status : "idle";
  const errorMessage =
    playback.source === source ? playback.message : "";

  const updatePlayback = useCallback(
    (status, message = "") => {
      setPlayback({ source, status, message });
    },
    [source],
  );

  const startPlayback = useCallback(
    (restart = false) => {
      const video = videoRef.current;
      if (!video || !source) {
        return;
      }

      attemptedSourceRef.current = source;
      updatePlayback("loading");

      if (restart) {
        try {
          video.currentTime = 0;
        } catch {
          // Playback can still begin at zero once metadata becomes available.
        }
      }

      const playRequest = video.play();
      playRequest?.catch(() => {
        updatePlayback(
          "error",
          "The movie could not start. Check your connection and try again.",
        );
      });
    },
    [source, updatePlayback],
  );

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      stopVideo(video);
      queueMicrotask(() => {
        if (video && !video.isConnected) {
          video.removeAttribute("src");
          video.load();
        }
      });
    };
  }, [source]);

  return (
    <section
      className={[
        "relative aspect-video w-full overflow-hidden rounded-md border border-border-strong bg-black",
        className,
      ].join(" ")}
      aria-label={`${title} movie player`}
    >
      {movie?.poster ? (
        <img
          src={movie.poster}
          alt=""
          className="absolute inset-0 block size-full object-cover opacity-35"
        />
      ) : null}

      {source ? (
        <video
          ref={videoRef}
          src={source}
          poster={movie?.poster || undefined}
          className="relative block size-full bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          aria-label={`Play ${title}`}
          onPlay={() => {
            attemptedSourceRef.current = source;
            updatePlayback("loading");
          }}
          onPlaying={() => updatePlayback("playing")}
          onWaiting={() => {
            if (attemptedSourceRef.current === source) {
              updatePlayback("loading");
            }
          }}
          onEnded={() => updatePlayback("ended")}
          onError={() =>
            updatePlayback(
              "error",
              "This movie is currently unavailable. Try again later.",
            )
          }
        >
          Your browser does not support HTML video.
        </video>
      ) : null}

      {source && playbackState === "idle" ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/28">
          <button
            type="button"
            className="pointer-events-auto grid size-16 place-items-center rounded-full border border-white/65 bg-black/72 text-white transition-[background-color,border-color] duration-[140ms] ease-out hover:border-white hover:bg-black/88 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus sm:size-20"
            aria-label={`Play ${title}`}
            onClick={() => startPlayback()}
          >
            <Play
              className="ml-1 size-7 fill-current sm:size-9"
              aria-hidden="true"
            />
          </button>
        </div>
      ) : null}

      {source && playbackState === "loading" ? (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center bg-black/48"
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-3 rounded-md border border-border bg-background-elevated/95 px-4 py-3 text-sm font-semibold">
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            Preparing movie
          </span>
        </div>
      ) : null}

      {source && playbackState === "ended" ? (
        <div className="absolute inset-0 grid place-items-center bg-black/78 px-5 text-center">
          <div>
            <p className="text-xl font-semibold">Playback ended</p>
            <Button className="mt-5" onClick={() => startPlayback(true)}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Replay
            </Button>
          </div>
        </div>
      ) : null}

      {source && playbackState === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-black/88 px-5 text-center">
          <div className="max-w-md">
            <CircleAlert
              className="mx-auto size-8 text-warning"
              aria-hidden="true"
            />
            <p className="mt-4 font-semibold">Movie unavailable</p>
            <p className="mt-2 text-sm text-text-muted">{errorMessage}</p>
            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => startPlayback(true)}
            >
              Try again
            </Button>
          </div>
        </div>
      ) : null}

      {!source ? (
        <div className="absolute inset-0 grid place-items-center bg-black/72 px-5 text-center">
          <div>
            <CircleAlert
              className="mx-auto size-8 text-text-muted"
              aria-hidden="true"
            />
            <p className="mt-4 font-semibold">Movie unavailable</p>
            <p className="mt-2 text-sm text-text-muted">
              A playable video is not available for this title.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
