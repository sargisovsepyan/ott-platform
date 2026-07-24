import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { buttonClassName } from "../../components/ui/buttonStyles";

export function HomePage() {
  return (
    <PageContainer className="grid min-h-[calc(100svh-3.75rem)] place-items-center py-16 md:min-h-[calc(100svh-4.25rem)] lg:min-h-[calc(100svh-4.5rem)]">
      <section className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-hover">
          Curated cinema
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.025em] sm:text-5xl lg:text-6xl">
          Find the next story worth your attention.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-text-muted">
          Explore the catalogue through a calm, focused experience designed around
          the films themselves.
        </p>
        <Link to="/movies" className={buttonClassName("primary", "mt-8")}>
          Browse movies
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </PageContainer>
  );
}
