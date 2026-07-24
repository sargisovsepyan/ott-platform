import { Link } from "react-router";
import { Clapperboard } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function NotFoundPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12 text-center">
      <section className="max-w-lg">
        <Clapperboard className="mx-auto size-10 text-primary-hover" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-semibold">This page is off-screen</h1>
        <p className="mt-4 text-text-muted">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link to="/" className={buttonClassName("secondary", "mt-7")}>
          Return home
        </Link>
      </section>
    </PageContainer>
  );
}
