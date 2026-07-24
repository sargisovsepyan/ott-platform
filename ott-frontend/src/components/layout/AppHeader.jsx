import { useCallback, useEffect, useRef, useState } from "react";
import { Clapperboard, Menu, Search } from "lucide-react";
import { NavLink, Link as RouterLink, useLocation } from "react-router";
import { IconButton } from "../ui/IconButton";
import { buttonClassName } from "../ui/buttonStyles";
import { useAuth } from "../../hooks/useAuth";
import { MobileNavigation } from "./MobileNavigation";
import { PageContainer } from "./PageContainer";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
];

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 20);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 h-15 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[140ms] ease-out md:h-17 lg:h-18",
          isHome && !isScrolled
            ? "border-transparent bg-background/25"
            : "border-border/80 bg-background-elevated/88 shadow-nav backdrop-blur-xl",
        ].join(" ")}
      >
        <PageContainer className="flex h-full items-center justify-between gap-5">
          <RouterLink
            to="/"
            className="group inline-flex min-h-11 items-center gap-2.5 text-lg font-bold tracking-[0.14em] text-text"
            aria-label="Lumio home"
          >
            <span className="grid size-8 place-items-center rounded-md border border-primary/55 bg-primary-soft text-primary-hover transition-colors duration-[140ms] ease-out group-hover:border-primary group-hover:bg-primary/20">
              <Clapperboard className="size-4.5" aria-hidden="true" />
            </span>
            LUMIO
          </RouterLink>

          <nav className="hidden h-full items-center gap-8 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  [
                    "relative flex h-full items-center text-sm font-semibold transition-colors duration-[140ms] ease-out",
                    isActive
                      ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                      : "text-text-muted hover:text-text",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink
                to="/admin/movies"
                className={({ isActive }) =>
                  [
                    "relative flex h-full items-center text-sm font-semibold transition-colors duration-[140ms] ease-out",
                    isActive
                      ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                      : "text-text-muted hover:text-text",
                  ].join(" ")
                }
              >
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="ml-auto hidden min-w-0 items-center justify-end gap-2 lg:flex">
            <RouterLink
              to="/movies"
              className="inline-flex size-11 items-center justify-center rounded-md border border-transparent text-text-muted transition-colors duration-[140ms] ease-out hover:border-border hover:bg-surface-hover hover:text-text"
              aria-label="Search movies"
            >
              <Search className="size-5" aria-hidden="true" />
            </RouterLink>
            {isAuthenticated ? (
              <>
                <span className="max-w-36 truncate px-2 text-sm font-medium text-text-muted">
                  {user?.name || user?.email}
                </span>
                <button className={buttonClassName("secondary")} onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <RouterLink to="/login" className={buttonClassName("ghost")}>
                  Log in
                </RouterLink>
                <RouterLink to="/register" className={buttonClassName("secondary")}>
                  Register
                </RouterLink>
              </>
            )}
          </div>

          <IconButton
            ref={menuButtonRef}
            label="Open menu"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="size-5" aria-hidden="true" />
          </IconButton>
        </PageContainer>
      </header>
      <div id="mobile-navigation">
        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={closeMenu}
          returnFocusRef={menuButtonRef}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          userName={user?.name || user?.email}
          onLogout={logout}
        />
      </div>
    </>
  );
}
