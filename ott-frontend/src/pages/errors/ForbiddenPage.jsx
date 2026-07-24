import { Link } from "react-router";
import { LockKeyhole } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function ForbiddenPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12 text-center">
      <section className="max-w-lg">
        <LockKeyhole className="mx-auto size-10 text-primary-hover" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
          Error 403
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Access is restricted</h1>
        <p className="mt-4 text-text-muted">
          Your account does not have permission to view this area.
        </p>
        <Link to="/movies" className={buttonClassName("secondary", "mt-7")}>
          Return to movies
        </Link>
      </section>
    </PageContainer>
  );
}
