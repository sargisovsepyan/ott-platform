import { BrowserRouter } from "react-router";
import { AuthProvider } from "../context/AuthProvider";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
