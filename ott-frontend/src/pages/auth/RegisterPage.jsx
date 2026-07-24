import { PageContainer } from "../../components/layout/PageContainer";

export function RegisterPage() {
  return (
    <PageContainer className="grid min-h-[70svh] place-items-center py-12">
      <section className="w-full max-w-md rounded-md border border-border bg-surface p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-hover">
          Create an account
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Join Lumio</h1>
        <p className="mt-3 text-text-muted">
          Registration fields will connect to the existing account service.
        </p>
      </section>
    </PageContainer>
  );
}
