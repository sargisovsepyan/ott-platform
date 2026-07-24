import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { X } from "lucide-react";
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
    <div className="fixed inset-0 top-15 z-40 bg-background md:hidden">
      <nav
        ref={panelRef}
        tabIndex={-1}
        aria-label="Mobile navigation"
        className="content-container py-5"
      >
        <div className="mb-4 flex justify-end">
          <IconButton label="Close menu" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="grid border-t border-border">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex min-h-12 items-center border-b border-border text-lg font-medium",
                  isActive ? "text-text" : "text-text-muted",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin ? (
            <NavLink
              to="/admin/movies"
              onClick={onClose}
              className="flex min-h-12 items-center border-b border-border text-lg font-medium text-text-muted"
            >
              Admin
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <>
              <p className="m-0 border-b border-border py-3 text-sm text-text-subtle">
                Signed in as {userName}
              </p>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex min-h-12 items-center border-b border-border text-left text-lg font-medium text-text-muted"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={onClose}
                className="flex min-h-12 items-center border-b border-border text-lg font-medium text-text-muted"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                onClick={onClose}
                className="flex min-h-12 items-center border-b border-border text-lg font-medium text-text-muted"
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
