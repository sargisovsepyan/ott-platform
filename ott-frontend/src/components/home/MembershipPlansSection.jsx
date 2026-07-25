import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { Check, Sparkles, X } from "lucide-react";
import { MEMBERSHIP_PLANS } from "../../data/membershipPlans";
import { useAuth } from "../../hooks/useAuth";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { PageContainer } from "../layout/PageContainer";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { buttonClassName } from "../ui/buttonStyles";

function PaymentPreview() {
  const fieldClassName =
    "min-h-11 w-full rounded-md border border-border bg-background/75 px-3.5 text-sm text-text-subtle placeholder:text-text-subtle disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <fieldset
      disabled
      className="mt-6 rounded-md border border-border bg-background-elevated/65 p-4"
    >
      <legend className="px-1 text-sm font-semibold text-text">
        Payment preview
      </legend>
      <p className="text-xs leading-relaxed text-text-subtle">
        Demo checkout — payment processing is not connected yet.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-semibold text-text-muted sm:col-span-2">
          Cardholder name
          <input
            type="text"
            disabled
            placeholder="FULL NAME"
            className={fieldClassName}
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-text-muted sm:col-span-2">
          Card number
          <input
            type="text"
            disabled
            placeholder="•••• •••• •••• ••••"
            className={fieldClassName}
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-text-muted">
          Expiry date
          <input
            type="text"
            disabled
            placeholder="MM / YY"
            className={fieldClassName}
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-text-muted">
          Security code
          <input
            type="text"
            disabled
            placeholder="CVV"
            className={fieldClassName}
          />
        </label>
      </div>
    </fieldset>
  );
}

function PlanDetailsDialog({ plan, onClose, isAuthenticated }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!plan) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
  }, [plan]);

  if (!plan) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-overlay px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="panel-surface max-h-[calc(100svh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-lg p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="page-eyebrow">Lumio membership</p>
            <h2 id={titleId} className="mt-2 text-3xl font-semibold">
              {plan.name}
            </h2>
            <p id={descriptionId} className="mt-2 text-text-muted">
              Review this demo plan and preview the upcoming checkout experience.
            </p>
          </div>
          <IconButton
            ref={closeButtonRef}
            label="Close plan details"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <p className="mt-7 flex items-baseline gap-2">
          <strong className="text-4xl font-semibold tracking-[-0.035em]">
            {plan.price}
          </strong>
          <span className="text-sm text-text-muted">{plan.cadence}</span>
        </p>
        <ul className="mt-6 grid gap-3" aria-label={`${plan.name} features`}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm text-text-muted">
              <Check
                className="mt-0.5 size-4.5 shrink-0 text-primary-hover"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
        <PaymentPreview />
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled>Checkout unavailable</Button>
          {isAuthenticated ? (
            <Button onClick={onClose}>Continue exploring</Button>
          ) : (
            <Link
              to={`/register?plan=${plan.slug}`}
              state={TOP_SCROLL_STATE}
              className={buttonClassName("primary")}
              onClick={onClose}
            >
              Create account
            </Link>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

export function MembershipPlansSection() {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <>
      <section
        id="plans"
        className="membership-section scroll-mt-24"
        aria-labelledby="membership-plans-heading"
        tabIndex={-1}
      >
        <PageContainer>
          <header className="mx-auto max-w-2xl text-center">
            <p className="page-eyebrow">Choose your experience</p>
            <h2
              id="membership-plans-heading"
              className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl"
            >
              Membership plans
            </h2>
            <p className="mt-4 text-text-muted">
              A simple concept for enjoying Lumio your way.
            </p>
          </header>
          <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-stretch">
            {MEMBERSHIP_PLANS.map((plan) => (
              <article
                key={plan.slug}
                className={[
                  "membership-card",
                  plan.badge ? "membership-card-featured" : "",
                ].join(" ")}
              >
                <div>
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-text">
                      {plan.name}
                    </p>
                    {plan.badge ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/45 bg-primary-soft px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.11em] text-primary-hover">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-6 flex items-baseline gap-2">
                    <strong className="text-4xl font-semibold tracking-[-0.035em]">
                      {plan.price}
                    </strong>
                    <span className="text-sm text-text-muted">{plan.cadence}</span>
                  </p>
                  <ul className="mt-7 grid gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm text-text-muted"
                      >
                        <Check
                          className="mt-0.5 size-4.5 shrink-0 text-primary-hover"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant={plan.badge ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  onClick={() => setSelectedPlan(plan)}
                  aria-haspopup="dialog"
                >
                  View {plan.name} plan
                </Button>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-text-subtle">
            Demo checkout — payment processing is not connected yet.
          </p>
        </PageContainer>
      </section>
      <PlanDetailsDialog
        plan={selectedPlan}
        isAuthenticated={isAuthenticated}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}
