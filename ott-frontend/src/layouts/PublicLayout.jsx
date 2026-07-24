import { Outlet } from "react-router";
import { AppFooter } from "../components/layout/AppFooter";
import { AppHeader } from "../components/layout/AppHeader";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-4 py-2 font-semibold text-text focus:translate-y-0"
      >
        Skip to content
      </a>
      <AppHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
