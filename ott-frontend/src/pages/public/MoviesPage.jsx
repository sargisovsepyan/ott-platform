import { PageContainer } from "../../components/layout/PageContainer";
import { EmptyState } from "../../components/feedback/EmptyState";

export function MoviesPage() {
  return (
    <PageContainer className="page-section">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
        Catalogue
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
        Movies
      </h1>
      <div className="mt-10">
        <EmptyState
          title="Catalogue ready for connection"
          message="Movie discovery will appear here as soon as the API layer is connected."
        />
      </div>
    </PageContainer>
  );
}
