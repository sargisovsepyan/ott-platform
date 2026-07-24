import { useCallback, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import { NavLink, Link as RouterLink } from "react-router";
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
  const menuButtonRef = useRef(null);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 h-15 border-b border-border bg-background md:h-17 lg:h-18">
        <PageContainer className="flex h-full items-center justify-between gap-5">
          <RouterLink
            to="/"
            className="text-xl font-semibold tracking-[0.08em] text-text"
            aria-label="Lumio home"
          >
            LUMIO
          </RouterLink>

          <nav className="hidden h-full items-center gap-7 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  [
                    "relative flex h-full items-center text-sm font-medium transition-colors duration-[140ms] ease-out",
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
                    "relative flex h-full items-center text-sm font-medium transition-colors duration-[140ms] ease-out",
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

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <RouterLink
              to="/movies"
              className="inline-flex size-11 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover hover:text-text"
              aria-label="Search movies"
            >
              <Search className="size-5" aria-hidden="true" />
            </RouterLink>
            {isAuthenticated ? (
              <>
                <span className="max-w-32 truncate px-2 text-sm text-text-muted">
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
            className="md:hidden"
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
