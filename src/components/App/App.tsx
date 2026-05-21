import { useState } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [isLoader, setIsIsLoader] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const fetchMovie = async (query: string) => {
    try {
      setIsError(false);
      setIsIsLoader(true);
      setMovies([]);
      const data = await fetchMovies(query);
      if (data.length === 0) {
        toast.error('No movies found for your request.');
        return;
      }
      setMovies(data);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsIsLoader(false);
    }
  };

  const showMovieModal = async (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={fetchMovie} />
      {isLoader ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={showMovieModal} />
      )}
      {isError && <ErrorMessage />}
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
