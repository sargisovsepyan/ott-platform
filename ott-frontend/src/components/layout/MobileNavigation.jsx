import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { X } from "lucide-react";
import { TOP_SCROLL_STATE } from "../../utils/scrollNavigation";
import { IconButton } from "../ui/IconButton";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
];

export function MobileNavigation({
  isOpen,
  onClose,
  returnFocusRef,
  isAuthenticated,
  isAdmin,
  userName,
  onLogout,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusElement?.focus();
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 top-15 z-40 bg-overlay backdrop-blur-sm md:top-17 lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <nav
        ref={panelRef}
        tabIndex={-1}
        aria-label="Mobile navigation"
        className="ml-auto flex h-full w-full max-w-sm flex-col border-l border-border bg-background-elevated px-5 py-5 shadow-panel"
      >
        <div className="mb-4 flex justify-end">
          <IconButton label="Close menu" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="grid border-t border-border/80">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              state={TOP_SCROLL_STATE}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex min-h-14 items-center border-b border-border/80 text-lg font-semibold transition-colors duration-[140ms] ease-out",
                  isActive ? "text-text" : "text-text-muted hover:text-text",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin ? (
            <NavLink
              to="/admin/movies"
              state={TOP_SCROLL_STATE}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex min-h-14 items-center border-b border-border/80 text-lg font-semibold transition-colors duration-[140ms] ease-out",
                  isActive ? "text-text" : "text-text-muted hover:text-text",
                ].join(" ")
              }
            >
              Admin
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <>
              <p className="m-0 border-b border-border/80 py-4 text-sm text-text-subtle">
                Signed in as {userName}
              </p>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex min-h-14 items-center border-b border-border/80 text-left text-lg font-semibold text-text-muted transition-colors duration-[140ms] ease-out hover:text-text"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                state={TOP_SCROLL_STATE}
                onClick={onClose}
                className="flex min-h-14 items-center border-b border-border/80 text-lg font-semibold text-text-muted transition-colors duration-[140ms] ease-out hover:text-text"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                state={TOP_SCROLL_STATE}
                onClick={onClose}
                className="flex min-h-14 items-center border-b border-border/80 text-lg font-semibold text-text-muted transition-colors duration-[140ms] ease-out hover:text-text"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
