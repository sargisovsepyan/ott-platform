import { useState } from "react";
import { useNavigate } from "react-router";
import { createMovie } from "../../api/moviesApi";
import { MovieForm } from "../../components/forms/MovieForm";
import { PosterUpload } from "../../components/forms/PosterUpload";
import { PageContainer } from "../../components/layout/PageContainer";

function getRequestMessage(error) {
  return error.errors?.length
    ? `${error.message} ${error.errors.join(" ")}`
    : error.message;
}

export function CreateMoviePage() {
  const navigate = useNavigate();
  const [poster, setPoster] = useState(null);
  const [posterError, setPosterError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate("/admin/movies", {
        replace: true,
        state: { message: `${movie.title} was added to the catalogue.` },
      });
    } catch (error) {
      setRequestError(getRequestMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="page-section">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
        Administration
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em]">
        Add a movie
      </h1>
      <p className="mt-4 max-w-2xl text-text-muted">
        Add catalogue metadata and the required poster in one request.
      </p>
      <div className="mt-10 max-w-4xl rounded-md border border-border bg-surface p-5 sm:p-8">
        <MovieForm
          submitLabel="Create movie"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          requestError={requestError}
        >
          <PosterUpload
            required
            onFileChange={(file) => {
              setPoster(file);
              setPosterError("");
            }}
            error={posterError}
          />
        </MovieForm>
      </div>
    </PageContainer>
  );
}
