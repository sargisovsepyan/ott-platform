import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Alert } from "../../components/feedback/Alert";
import { AuthPageShell } from "../../components/layout/AuthPageShell";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { getMembershipPlan } from "../../data/membershipPlans";
import { useAuth } from "../../hooks/useAuth";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";

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
  const [searchParams] = useSearchParams();
  const selectedPlan = getMembershipPlan(searchParams.get("plan"));
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
    <AuthPageShell
      eyebrow="Create an account"
      title="Join Lumio"
      description="Create an account, then log in to continue."
      footer={
        <p className="text-sm text-text-muted">
          Already registered?{" "}
          <Link
            className="font-semibold text-primary-hover hover:underline"
            to="/login"
            state={TOP_SCROLL_STATE}
          >
            Log in
          </Link>
        </p>
      }
    >
        {selectedPlan ? (
          <section
            className="mt-6 rounded-md border border-primary/35 bg-primary-soft/30 px-4 py-3.5"
            aria-label="Selected membership plan"
          >
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-hover">
              Selected demo plan
            </p>
            <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
              <strong className="text-base text-text">{selectedPlan.name}</strong>
              <span className="text-sm text-text-muted">
                {selectedPlan.price} {selectedPlan.cadence}
              </span>
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-text-subtle">
              Registration remains independent of this product-demo selection.
            </p>
          </section>
        ) : null}
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
              <PasswordInput
                id="password"
                name="password"
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
    </AuthPageShell>
  );
}
