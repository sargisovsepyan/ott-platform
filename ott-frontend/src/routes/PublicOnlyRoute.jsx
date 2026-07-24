import { Navigate, Outlet } from "react-router";
import { Spinner } from "../components/feedback/Spinner";
import { useAuth } from "../hooks/useAuth";

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="grid min-h-[50svh] place-items-center">
        <Spinner label="Restoring your session" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
