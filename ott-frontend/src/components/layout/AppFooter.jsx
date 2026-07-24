import { PageContainer } from "./PageContainer";

export function AppFooter() {
  return (
    <footer className="footer-atmosphere relative mt-auto overflow-hidden border-t border-border/70 bg-background-elevated/80 py-10">
      <PageContainer className="relative flex flex-col gap-3 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="m-0 font-bold tracking-[0.16em] text-text">LUMIO</p>
          <p className="mt-1 text-xs uppercase tracking-[0.11em] text-text-subtle">
            Curated cinema
          </p>
        </div>
        <p className="m-0 max-w-md sm:text-right">
          A focused space for discovering and managing remarkable films.
        </p>
      </PageContainer>
    </footer>
  );
}
