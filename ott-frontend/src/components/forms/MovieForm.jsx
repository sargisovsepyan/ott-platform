import { useState } from "react";
import { Link } from "react-router";
import { Alert } from "../feedback/Alert";
import { Button } from "../ui/Button";
import { buttonClassName } from "../ui/buttonStyles";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const maximumYear = new Date().getFullYear() + 5;

function createValues(initialValues) {
  return {
    title: initialValues?.title ?? "",
    year: initialValues?.year ? String(initialValues.year) : "",
    genre: initialValues?.genre ?? "",
    rating:
      initialValues?.rating !== undefined && initialValues?.rating !== null
        ? String(initialValues.rating)
        : "",
    description: initialValues?.description ?? "",
  };
}

function validate(values) {
  const errors = {};
  const year = Number(values.year);
  const rating = values.rating === "" ? 0 : Number(values.rating);

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length > 150) {
    errors.title = "Title must be 150 characters or fewer.";
  }

  if (!Number.isInteger(year) || year < 1888 || year > maximumYear) {
    errors.year = `Year must be an integer from 1888 to ${maximumYear}.`;
  }

  if (!values.genre.trim()) {
    errors.genre = "Genre is required.";
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
    errors.rating = "Rating must be between 0 and 10.";
  }

  if (values.description.trim().length > 2000) {
    errors.description = "Description must be 2,000 characters or fewer.";
  }

  return errors;
}

export function MovieForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting,
  requestError,
  cancelHref = "/admin/movies",
  children,
}) {
  const [values, setValues] = useState(() => createValues(initialValues));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: values.title.trim(),
      year: Number(values.year),
      genre: values.genre.trim(),
      description: values.description.trim(),
      rating: values.rating === "" ? 0 : Number(values.rating),
    });
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      {requestError ? (
        <Alert tone="error" title="The movie could not be saved">
          {requestError}
        </Alert>
      ) : null}
      <p className="m-0 text-sm text-text-muted">
        Fields marked with <span className="text-danger">*</span> are required.
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          id="movie-title"
          label="Title"
          required
          error={errors.title}
          hint={`${values.title.length}/150 characters`}
          className="md:col-span-2"
        >
          {({ describedBy, invalid }) => (
            <Input
              id="movie-title"
              name="title"
              value={values.title}
              onChange={handleChange}
              maxLength="150"
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </FormField>
        <FormField id="movie-year" label="Year" required error={errors.year}>
          {({ describedBy, invalid }) => (
            <Input
              id="movie-year"
              name="year"
              type="number"
              min="1888"
              max={maximumYear}
              step="1"
              value={values.year}
              onChange={handleChange}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </FormField>
        <FormField id="movie-rating" label="Rating" error={errors.rating}>
          {({ describedBy, invalid }) => (
            <Input
              id="movie-rating"
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={values.rating}
              onChange={handleChange}
              placeholder="0"
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </FormField>
        <FormField
          id="movie-genre"
          label="Genre"
          required
          error={errors.genre}
          className="md:col-span-2"
        >
          {({ describedBy, invalid }) => (
            <Input
              id="movie-genre"
              name="genre"
              value={values.genre}
              onChange={handleChange}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </FormField>
        <FormField
          id="movie-description"
          label="Description"
          error={errors.description}
          hint={`${values.description.length}/2000 characters`}
          className="md:col-span-2"
        >
          {({ describedBy, invalid }) => (
            <Textarea
              id="movie-description"
              name="description"
              value={values.description}
              onChange={handleChange}
              maxLength="2000"
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </FormField>
      </div>
      {children}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {isSubmitting ? (
          <Button variant="secondary" disabled>
            Cancel
          </Button>
        ) : (
          <Link to={cancelHref} className={buttonClassName("secondary")}>
            Cancel
          </Link>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
