import { BrowserRouter } from "react-router";
import { ScrollManager } from "../components/layout/ScrollManager";
import { AuthProvider } from "../context/AuthProvider";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollManager />
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
}
