import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  deleteMovieVideo,
  getMovie,
  updateMovie,
  updateMovieVideo,
  updateMoviePoster,
} from "../../api/moviesApi";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { Alert } from "../../components/feedback/Alert";
import { MovieForm } from "../../components/forms/MovieForm";
import { MovieVideoUpload } from "../../components/forms/MovieVideoUpload";
import { PosterUpload } from "../../components/forms/PosterUpload";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { createMovieDetailState } from "../../utils/movieNavigation";
import { getVideoUrl } from "../../utils/video";

function getRequestMessage(error) {
  return error.errors?.length
    ? `${error.message} ${error.errors.join(" ")}`
    : error.message;
}

export function EditMoviePage() {
  const { id } = useParams();
  const location = useLocation();
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    movie: null,
    error: "",
  });
  const [metadataError, setMetadataError] = useState("");
  const [posterError, setPosterError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [videoDeleteError, setVideoDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);
  const [isSavingPoster, setIsSavingPoster] = useState(false);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [isVideoDeleteOpen, setIsVideoDeleteOpen] = useState(false);
  const [posterResetKey, setPosterResetKey] = useState(0);
  const [videoResetKey, setVideoResetKey] = useState(0);
  const retry = useCallback(() => setRequestKey((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    getMovie(id, { signal: controller.signal })
      .then((movie) => setState({ status: "success", movie, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ status: "error", movie: null, error: error.message });
        }
      });
    return () => controller.abort();
  }, [id, requestKey]);

  const handleMetadataSubmit = async (fields) => {
    setIsSavingMetadata(true);
    setMetadataError("");
    setSuccessMessage("");
    try {
      const movie = await updateMovie(id, fields);
      setState({ status: "success", movie, error: "" });
      setSuccessMessage("Movie information was updated.");
    } catch (error) {
      setMetadataError(getRequestMessage(error));
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handlePosterSubmit = async () => {
    if (isSavingPoster) {
      return;
    }

    if (!selectedPoster) {
      setPosterError("Choose a new poster before updating.");
      return;
    }

    setIsSavingPoster(true);
    setPosterError("");
    setSuccessMessage("");
    const formData = new FormData();
    formData.append("poster", selectedPoster);

    try {
      const movie = await updateMoviePoster(id, formData);
      setState({ status: "success", movie, error: "" });
      setSelectedPoster(null);
      setPosterResetKey((value) => value + 1);
      setSuccessMessage("The new poster was uploaded and saved.");
    } catch (error) {
      setPosterError(getRequestMessage(error));
    } finally {
      setIsSavingPoster(false);
    }
  };

  const handleVideoSubmit = async () => {
    if (isSavingVideo || isDeletingVideo) {
      return;
    }

    if (!selectedVideo) {
      setVideoError("Choose an MP4 movie video before uploading.");
      return;
    }

    setIsSavingVideo(true);
    setVideoError("");
    setSuccessMessage("");
    try {
      const movie = await updateMovieVideo(id, selectedVideo);
      setState({ status: "success", movie, error: "" });
      setSelectedVideo(null);
      setVideoResetKey((value) => value + 1);
      setSuccessMessage("The movie video was uploaded and saved.");
    } catch (error) {
      setVideoError(getRequestMessage(error));
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleVideoDelete = async () => {
    if (isDeletingVideo || isSavingVideo) {
      return;
    }

    setIsDeletingVideo(true);
    setVideoDeleteError("");
    setSuccessMessage("");
    try {
      const movie = await deleteMovieVideo(id);
      setState({ status: "success", movie, error: "" });
      setSelectedVideo(null);
      setVideoResetKey((value) => value + 1);
      setIsVideoDeleteOpen(false);
      setSuccessMessage(
        "The uploaded video was removed. The default Coming Soon video is now active.",
      );
    } catch (error) {
      setVideoDeleteError(
        error.status === 400
          ? "This movie does not have an uploaded video to remove."
          : getRequestMessage(error),
      );
    } finally {
      setIsDeletingVideo(false);
    }
  };

  if (state.status === "loading") {
    return (
      <PageContainer className="page-section">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-[36rem] w-full" />
      </PageContainer>
    );
  }

  if (state.status === "error") {
    return (
      <PageContainer className="page-section">
        <ErrorState
          title="The movie could not be loaded"
          message={state.error}
          onRetry={retry}
        />
      </PageContainer>
    );
  }

  const { movie } = state;

  return (
    <PageContainer className="page-section">
      <Link
        to="/admin/movies"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to management
      </Link>
      <header className="admin-intro mt-4 rounded-lg px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <p className="page-eyebrow">Catalogue editor</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Edit {movie.title}
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          Refine movie information, poster, and movie video as separate
          updates.
        </p>
      </header>
      {successMessage ? (
        <Alert tone="success" className="mt-6">
          {successMessage}
        </Alert>
      ) : null}
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] xl:items-start">
        <div className="panel-surface rounded-lg p-4 sm:p-6 lg:p-8">
          <MovieForm
            key={movie.id}
            initialValues={movie}
            submitLabel="Save information"
            onSubmit={handleMetadataSubmit}
            isSubmitting={isSavingMetadata}
            requestError={metadataError}
          />
        </div>
        <div className="grid gap-6">
          <section className="panel-surface rounded-lg p-5 sm:p-6">
            <PosterUpload
              key={posterResetKey}
              currentPoster={movie.poster}
              currentPosterVersion={movie.updatedAt}
              movieTitle={movie.title}
              disabled={isSavingPoster}
              onFileChange={(file) => {
                setSelectedPoster(file);
                setPosterError("");
              }}
              error={posterError}
            />
            <div className="mt-6 flex justify-end border-t border-border pt-6">
              <Button
                onClick={handlePosterSubmit}
                isLoading={isSavingPoster}
                disabled={!selectedPoster || isSavingPoster}
                className="w-full sm:w-auto"
              >
                Update poster
              </Button>
            </div>
          </section>
          <section className="panel-surface rounded-lg p-5 sm:p-6">
            <MovieVideoUpload
              key={videoResetKey}
              movie={movie}
              disabled={isSavingVideo || isDeletingVideo}
              onFileChange={(file) => {
                setSelectedVideo(file);
                setVideoError("");
              }}
              error={videoError}
            />
            <p className="mt-5 text-xs leading-relaxed text-text-subtle">
              Removing the uploaded video will restore the default Coming Soon
              video.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Button
                variant="danger"
                onClick={() => {
                  setVideoDeleteError("");
                  setIsVideoDeleteOpen(true);
                }}
                disabled={
                  !getVideoUrl(movie.videoUrl) ||
                  isSavingVideo ||
                  isDeletingVideo
                }
                className="w-full sm:w-auto"
              >
                Remove uploaded video
              </Button>
              <Button
                onClick={handleVideoSubmit}
                isLoading={isSavingVideo}
                disabled={
                  !selectedVideo ||
                  isSavingVideo ||
                  isDeletingVideo
                }
                className="w-full sm:w-auto"
              >
                {getVideoUrl(movie.videoUrl)
                  ? "Replace video"
                  : "Upload video"}
              </Button>
            </div>
          </section>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Link
          to={`/movies/${movie.id}`}
          state={createMovieDetailState(location, "Back to movie editor")}
          className={buttonClassName("ghost")}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View public details
        </Link>
      </div>
      <ConfirmDialog
        isOpen={isVideoDeleteOpen}
        title="Remove uploaded video?"
        message={`Remove the uploaded video from ${movie.title}? Removing the uploaded video will restore the default Coming Soon video.`}
        confirmLabel="Remove uploaded video"
        isLoading={isDeletingVideo}
        error={videoDeleteError}
        onConfirm={handleVideoDelete}
        onClose={() => {
          if (!isDeletingVideo) {
            setIsVideoDeleteOpen(false);
            setVideoDeleteError("");
          }
        }}
      />
    </PageContainer>
  );
}
