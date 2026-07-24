import { Outlet } from "react-router";
import { AppFooter } from "../components/layout/AppFooter";
import { AppHeader } from "../components/layout/AppHeader";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip text-text">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[120] -translate-y-20 rounded-md bg-primary px-4 py-2 font-semibold text-text shadow-glow transition-transform duration-[180ms] ease-out focus:translate-y-0"
      >
        Skip to content
      </a>
      <AppHeader />
      <main
        id="main-content"
        className="min-w-0 flex-1 pt-15 md:pt-17 lg:pt-18"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
