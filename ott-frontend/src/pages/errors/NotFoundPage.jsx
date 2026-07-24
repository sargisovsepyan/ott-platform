import { Link } from "react-router";
import { Clapperboard } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function NotFoundPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12 text-center sm:py-16">
      <section className="panel-surface w-full max-w-2xl rounded-lg px-5 py-12 sm:px-10 sm:py-16">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-primary/35 bg-primary-soft/60 text-primary-hover">
          <Clapperboard className="size-7" aria-hidden="true" />
        </span>
        <p className="page-eyebrow mt-6">Error 404</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          This page is off-screen
        </h1>
        <p className="mt-4 text-text-muted">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          to="/"
          className={buttonClassName("secondary", "mt-8 w-full sm:w-auto")}
        >
          Return home
        </Link>
      </section>
    </PageContainer>
  );
}
