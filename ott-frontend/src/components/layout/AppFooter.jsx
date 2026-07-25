import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { usePlansNavigation } from "../../hooks/usePlansNavigation";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { PageContainer } from "./PageContainer";

export function AppFooter() {
  const { isAuthenticated } = useAuth();
  const handlePlansNavigation = usePlansNavigation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-atmosphere relative mt-auto overflow-hidden border-t border-border/70 bg-background-elevated/80 py-10 sm:py-12">
      <PageContainer className="relative grid gap-8 text-sm text-text-muted md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <p className="m-0 font-bold tracking-[0.16em] text-text">LUMIO</p>
          <p className="mt-1 text-xs uppercase tracking-[0.11em] text-text-subtle">
            CURATED STORIES
          </p>
          <p className="mt-4 max-w-sm">
            Discover stories worth your time.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 md:max-w-md md:justify-end"
          aria-label="Footer"
        >
          <Link className="footer-link" to="/" state={TOP_SCROLL_STATE}>
            Home
          </Link>
          <Link className="footer-link" to="/movies" state={TOP_SCROLL_STATE}>
            Movies
          </Link>
          <Link
            className="footer-link"
            to="/#plans"
            onClick={handlePlansNavigation}
          >
            Plans
          </Link>
          {!isAuthenticated ? (
            <>
              <Link
                className="footer-link"
                to="/login"
                state={TOP_SCROLL_STATE}
              >
                Log in
              </Link>
              <Link
                className="footer-link"
                to="/register"
                state={TOP_SCROLL_STATE}
              >
                Create account
              </Link>
            </>
          ) : null}
        </nav>
        <p className="border-t border-border/70 pt-5 text-xs text-text-subtle md:col-span-2">
          © {currentYear} Lumio. Curated stories, thoughtfully presented.
        </p>
      </PageContainer>
    </footer>
  );
}
