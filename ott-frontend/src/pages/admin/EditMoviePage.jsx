import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  getMovie,
  updateMovie,
  updateMoviePoster,
} from "../../api/moviesApi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { Alert } from "../../components/feedback/Alert";
import { MovieForm } from "../../components/forms/MovieForm";
import { PosterUpload } from "../../components/forms/PosterUpload";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";

function getRequestMessage(error) {
  return error.errors?.length
    ? `${error.message} ${error.errors.join(" ")}`
    : error.message;
}

export function EditMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    movie: null,
    error: "",
  });
  const [metadataError, setMetadataError] = useState("");
  const [posterError, setPosterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);
  const [isSavingPoster, setIsSavingPoster] = useState(false);
  const [posterResetKey, setPosterResetKey] = useState(0);
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
      setSuccessMessage("The poster was replaced.");
    } catch (error) {
      setPosterError(getRequestMessage(error));
    } finally {
      setIsSavingPoster(false);
    }
  };

  if (state.status === "loading") {
    return (
      <PageContainer className="page-section">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-[36rem] w-full max-w-4xl" />
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
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
        Administration
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em]">
        Edit {movie.title}
      </h1>
      {successMessage ? (
        <Alert tone="success" className="mt-6 max-w-4xl">
          {successMessage}
        </Alert>
      ) : null}
      <div className="mt-10 max-w-4xl rounded-md border border-border bg-surface p-5 sm:p-8">
        <MovieForm
          key={movie.id}
          initialValues={movie}
          submitLabel="Save information"
          onSubmit={handleMetadataSubmit}
          isSubmitting={isSavingMetadata}
          requestError={metadataError}
        />
      </div>
      <section className="mt-8 max-w-4xl rounded-md border border-border bg-surface p-5 sm:p-8">
        <PosterUpload
          key={posterResetKey}
          currentPoster={movie.poster}
          movieTitle={movie.title}
          onFileChange={(file) => {
            setSelectedPoster(file);
            setPosterError("");
          }}
          error={posterError}
        />
        <div className="mt-6 flex justify-end border-t border-border pt-6">
          <Button onClick={handlePosterSubmit} isLoading={isSavingPoster}>
            Update poster
          </Button>
        </div>
      </section>
      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate(`/movies/${movie.id}`)}>
          View public details
        </Button>
      </div>
    </PageContainer>
  );
}
