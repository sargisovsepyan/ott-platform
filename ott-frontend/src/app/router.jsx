import { Navigate, Route, Routes } from "react-router";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { AdminMoviesPage } from "../pages/admin/AdminMoviesPage";
import { CreateMoviePage } from "../pages/admin/CreateMoviePage";
import { EditMoviePage } from "../pages/admin/EditMoviePage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForbiddenPage } from "../pages/errors/ForbiddenPage";
import { NotFoundPage } from "../pages/errors/NotFoundPage";
import { HomePage } from "../pages/public/HomePage";
import { MovieDetailsPage } from "../pages/public/MovieDetailsPage";
import { MoviesPage } from "../pages/public/MoviesPage";
import { AdminRoute } from "../routes/AdminRoute";
import { PublicOnlyRoute } from "../routes/PublicOnlyRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<Navigate to="/admin/movies" replace />} />
            <Route path="admin/movies" element={<AdminMoviesPage />} />
            <Route path="admin/movies/new" element={<CreateMoviePage />} />
            <Route path="admin/movies/:id/edit" element={<EditMoviePage />} />
          </Route>
        </Route>
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
