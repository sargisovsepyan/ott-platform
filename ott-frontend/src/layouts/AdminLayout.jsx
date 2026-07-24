import { NavLink, Outlet } from "react-router";
import { Plus } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";

const links = [
  { to: "/admin/movies", label: "Manage movies", end: true },
  { to: "/admin/movies/new", label: "Add movie", icon: Plus },
];

export function AdminLayout() {
  return (
    <div className="min-w-0">
      <div className="border-b border-border/70 bg-background-elevated/75 backdrop-blur-lg">
        <PageContainer>
          <nav
            className="scrollbar-hidden flex min-h-14 items-center gap-7 overflow-x-auto"
            aria-label="Administration"
          >
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    [
                      "inline-flex min-h-14 shrink-0 items-center gap-2 border-b-2 text-sm font-semibold transition-colors duration-[180ms]",
                      isActive
                        ? "border-primary text-text"
                        : "border-transparent text-text-muted hover:text-text",
                    ].join(" ")
                  }
                >
                  {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </PageContainer>
      </div>
      <Outlet />
    </div>
  );
}
