import { Navigate, Outlet, useLocation } from "react-router";
import { Spinner } from "../components/feedback/Spinner";
import { useAuth } from "../hooks/useAuth";

export function AdminRoute() {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="grid min-h-[50svh] place-items-center">
        <Spinner label="Checking administrator access" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
