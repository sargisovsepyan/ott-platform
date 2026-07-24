import { PageContainer } from "./PageContainer";

export function AppFooter() {
  return (
    <footer className="border-t border-border py-8">
      <PageContainer className="flex flex-col gap-2 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 font-semibold tracking-[0.08em] text-text">LUMIO</p>
        <p className="m-0">Movie discovery, presented with clarity.</p>
      </PageContainer>
    </footer>
  );
}
