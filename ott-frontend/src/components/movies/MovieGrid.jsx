import { MovieCard } from "./MovieCard";

export function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-y-9 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
