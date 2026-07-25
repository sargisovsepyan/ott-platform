import { BrowserRouter } from "react-router";
import { ScrollManager } from "../components/layout/ScrollManager";
import { AuthProvider } from "../context/AuthProvider";
import { MoviePreviewProvider } from "../context/MoviePreviewProvider";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoviePreviewProvider>
          <ScrollManager />
          {children}
        </MoviePreviewProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
