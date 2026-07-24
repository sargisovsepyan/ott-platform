import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert } from "../../components/feedback/Alert";
import { PageContainer } from "../../components/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
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
      const result = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate("/login", {
        replace: true,
        state: {
          email: result.user?.email ?? values.email.trim(),
          message: result.message,
        },
      });
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
          Create an account
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Join Lumio</h1>
        <p className="mt-3 text-text-muted">
          Create an account, then log in to continue.
        </p>
        {requestError ? (
          <Alert tone="error" className="mt-6">
            {requestError}
          </Alert>
        ) : null}
        <form className="mt-7 grid gap-5" onSubmit={handleSubmit} noValidate>
          <FormField id="name" label="Name" required error={errors.name}>
            {({ describedBy, invalid }) => (
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-describedby={describedBy}
                invalid={invalid}
              />
            )}
          </FormField>
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
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                aria-describedby={describedBy}
                invalid={invalid}
              />
            )}
          </FormField>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-text-muted">
          Already registered?{" "}
          <Link className="font-semibold text-primary-hover hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </section>
    </PageContainer>
  );
}
