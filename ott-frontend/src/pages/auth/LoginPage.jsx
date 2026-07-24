import { PageContainer } from "../../components/layout/PageContainer";

export function LoginPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12">
      <section className="w-full max-w-md rounded-md border border-border bg-surface p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Log in to Lumio</h1>
        <p className="mt-3 text-text-muted">
          Authentication fields will connect to the existing account service.
        </p>
      </section>
    </PageContainer>
  );
}
