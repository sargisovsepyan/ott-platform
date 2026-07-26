import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createMovie, updateMovieVideo } from "../../api/moviesApi";
import { Alert } from "../../components/feedback/Alert";
import { MovieForm } from "../../components/forms/MovieForm";
import { MovieVideoUpload } from "../../components/forms/MovieVideoUpload";
import { PosterUpload } from "../../components/forms/PosterUpload";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { formatFileSize } from "../../utils/video";

function getRequestMessage(error) {
  return error.errors?.length
    ? `${error.message} ${error.errors.join(" ")}`
    : error.message;
}

export function CreateMoviePage() {
  const navigate = useNavigate();
  const [poster, setPoster] = useState(null);
  const [posterError, setPosterError] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMovie, setCreatedMovie] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [isRetryingVideo, setIsRetryingVideo] = useState(false);

  const finishCreation = (movie, message) => {
    navigate("/admin/movies", {
      replace: true,
      state: { message: message ?? `${movie.title} was added to the catalogue.` },
    });
  };

  const handleSubmit = async (fields) => {
    if (!poster) {
      setPosterError("A poster is required to create a movie.");
      return;
    }

    setPosterError("");
    setRequestError("");
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("poster", poster);

    try {
      const movie = await createMovie(formData);
      if (!videoFile) {
        finishCreation(movie);
        return;
      }

      try {
        const updatedMovie = await updateMovieVideo(movie.id, videoFile);
        finishCreation(
          updatedMovie,
          `${updatedMovie.title} and its video were added to the catalogue.`,
        );
      } catch (error) {
        setCreatedMovie(movie);
        setVideoUploadError(getRequestMessage(error));
      }
    } catch (error) {
      setRequestError(getRequestMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryVideoUpload = async () => {
    if (!createdMovie || !videoFile || isRetryingVideo) {
      return;
    }

    setIsRetryingVideo(true);
    setVideoUploadError("");
    try {
      const updatedMovie = await updateMovieVideo(createdMovie.id, videoFile);
      finishCreation(
        updatedMovie,
        `${updatedMovie.title} and its video were added to the catalogue.`,
      );
    } catch (error) {
      setVideoUploadError(getRequestMessage(error));
    } finally {
      setIsRetryingVideo(false);
    }
  };

  return (
    <PageContainer className="page-section">
      <header className="admin-intro rounded-lg px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <p className="page-eyebrow">Catalogue editor</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Add a movie
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          Shape a complete catalogue entry with clear metadata, a portrait
          poster, and an optional movie video.
        </p>
      </header>
      {createdMovie ? (
        <section className="panel-surface mt-8 rounded-lg p-5 sm:p-7 lg:p-8">
          <Alert tone="warning" title="Movie created; video upload incomplete">
            {createdMovie.title} is already in the catalogue, but its selected
            video could not be uploaded. Retrying will update that movie and
            will not create a duplicate.
          </Alert>
          <div className="mt-6 rounded-md border border-border/80 bg-background-elevated/60 p-4">
            <p className="text-sm font-semibold text-text">Selected video</p>
            <p className="mt-2 break-all text-sm text-text-muted">
              {videoFile?.name}
            </p>
            <p className="mt-1 text-sm text-text-subtle">
              {formatFileSize(videoFile?.size)}
            </p>
          </div>
          {videoUploadError ? (
            <p className="mt-4 text-sm text-danger" role="alert">
              {videoUploadError}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={retryVideoUpload}
              isLoading={isRetryingVideo}
              disabled={!videoFile || isRetryingVideo}
            >
              Retry video upload
            </Button>
            <Link
              to={`/admin/movies/${createdMovie.id}/edit`}
              className={buttonClassName("secondary")}
            >
              Open movie editor
            </Link>
            <Link
              to="/admin/movies"
              state={{
                message: `${createdMovie.title} was added without an uploaded video.`,
              }}
              className={buttonClassName("ghost")}
            >
              Finish without uploaded video
            </Link>
          </div>
        </section>
      ) : (
        <div className="panel-surface mt-8 rounded-lg p-4 sm:p-6 lg:p-8">
          <MovieForm
            submitLabel="Create movie"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            requestError={requestError}
          >
            <div className="grid gap-7">
              <PosterUpload
                required
                disabled={isSubmitting}
                onFileChange={(file) => {
                  setPoster(file);
                  setPosterError("");
                }}
                error={posterError}
              />
              <div className="border-t border-border/75 pt-7">
                <MovieVideoUpload
                  optional
                  disabled={isSubmitting}
                  onFileChange={setVideoFile}
                />
              </div>
            </div>
          </MovieForm>
        </div>
      )}
    </PageContainer>
  );
}
