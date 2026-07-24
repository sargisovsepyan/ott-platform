import { NavLink, Outlet } from "react-router";
import { Plus } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";

const links = [
  { to: "/admin/movies", label: "Manage movies", end: true },
  { to: "/admin/movies/new", label: "Add movie", icon: Plus },
];

export function AdminLayout() {
  return (
    <div>
      <div className="border-b border-border bg-surface">
        <PageContainer>
          <nav className="flex min-h-12 items-center gap-6" aria-label="Administration">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    [
                      "inline-flex min-h-12 items-center gap-2 border-b-2 text-sm font-semibold",
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
