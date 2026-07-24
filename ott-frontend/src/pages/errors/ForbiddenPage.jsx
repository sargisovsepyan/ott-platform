import { Link } from "react-router";
import { LockKeyhole } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function ForbiddenPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12 text-center sm:py-16">
      <section className="panel-surface w-full max-w-2xl rounded-lg px-5 py-12 sm:px-10 sm:py-16">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-primary/35 bg-primary-soft/60 text-primary-hover">
          <LockKeyhole className="size-7" aria-hidden="true" />
        </span>
        <p className="page-eyebrow mt-6">Error 403</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Access is restricted
        </h1>
        <p className="mt-4 text-text-muted">
          Your account does not have permission to view this area.
        </p>
        <Link
          to="/movies"
          className={buttonClassName("secondary", "mt-8 w-full sm:w-auto")}
        >
          Return to movies
        </Link>
      </section>
    </PageContainer>
  );
}
