import { PageContainer } from "../../components/layout/PageContainer";

export function AdminMoviesPage() {
  return (
    <PageContainer className="page-section">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
        Administration
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em]">
        Movie management
      </h1>
    </PageContainer>
  );
}
