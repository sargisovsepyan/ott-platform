import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Alert } from "../../components/feedback/Alert";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { useAuth } from "../../hooks/useAuth";

function validate(values) {
  const errors = {};
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({
    email: location.state?.email ?? "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setRequestError("");
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      const requestedPath = location.state?.from;
      navigate(
        typeof requestedPath === "string" && requestedPath.startsWith("/")
          ? requestedPath
          : "/",
        { replace: true },
      );
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12">
      <section className="w-full max-w-md rounded-md border border-border bg-surface p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Log in to Lumio</h1>
        <p className="mt-3 text-text-muted">Continue your movie discovery session.</p>
        {location.state?.message ? (
          <Alert tone="success" className="mt-6">
            {location.state.message}
          </Alert>
        ) : null}
        {requestError ? (
          <Alert tone="error" className="mt-6">
            {requestError}
          </Alert>
        ) : null}
        <form className="mt-7 grid gap-5" onSubmit={handleSubmit} noValidate>
          <FormField id="email" label="Email" required error={errors.email}>
            {({ describedBy, invalid }) => (
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                aria-describedby={describedBy}
                invalid={invalid}
              />
            )}
          </FormField>
          <FormField id="password" label="Password" required error={errors.password}>
            {({ describedBy, invalid }) => (
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                aria-describedby={describedBy}
                invalid={invalid}
              />
            )}
          </FormField>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Log in
          </Button>
        </form>
        <p className="mt-6 text-sm text-text-muted">
          New to Lumio?{" "}
          <Link className="font-semibold text-primary-hover hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </PageContainer>
  );
}
