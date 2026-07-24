import { MovieCard } from "./MovieCard";

export function MovieGrid({ movies }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
