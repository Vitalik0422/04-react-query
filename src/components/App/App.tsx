import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PaginatedItems } from '../Pagination/Pagination';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 1;

  useEffect(() => {
    if (data?.results.length === 0)
      toast.error('No movies found for your request.');
  }, [data]);

  const handleMovieSearch = (query: string) => {
    setPage(1);
    setSearchQuery(query);
  };

  const showMovieModal = async (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleMovieSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {totalPages > 1 && (
        <PaginatedItems totalPages={totalPages} page={page} setPage={setPage} />
      )}
      {data && <MovieGrid movies={data.results} onSelect={showMovieModal} />}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null);
          }}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
