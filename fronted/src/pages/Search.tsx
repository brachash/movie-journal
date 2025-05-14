import { useState } from 'react';
import { searchMovies } from '../services/movies';
import { type Movie } from '../types/movie';
import { Link } from 'react-router-dom';
import '../styles/search.css';
import '../styles/movie-card.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'completed'>('idle');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('יש להזין מילת חיפוש');
      setMovies([]);
      setSearchStatus('completed');
      return;
    }
    setSearchStatus('loading');
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setError('');
      setSearchStatus('completed');
    } catch (err: any) {
      setError(err.response?.data.message || 'חיפוש הסרטים נכשל');
      setMovies([]);
      setSearchStatus('completed');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="netflix-search-page">
      <div className="netflix-search-container">
        <h2>חיפוש סרטים</h2>
        <form className="netflix-search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="netflix-search-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchStatus('idle');
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="חפש סרט..."
            />
          </div>
          <button type="submit" disabled={searchStatus === 'loading'}>
            {searchStatus === 'loading' ? 'מחפש...' : 'חפש'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {searchStatus === 'loading' && <div className="netflix-spinner">טוען...</div>}
        <div className="netflix-movies-grid">
          {searchStatus === 'completed' && movies.length === 0 && !error && (
            <p className="no-results">לא נמצאו סרטים</p>
          )}
          {movies.map((movie) => (
            <div key={movie.tmdbId} className="netflix-movie-card">
              {movie.poster && (
                <img src={movie.poster} alt={movie.title} className="netflix-movie-poster" />
              )}
              <div className="netflix-movie-info">
                <h3>{movie.title}</h3>
                <p>שנה: {movie.releaseYear || 'לא זמין'}</p>
                <p>דירוג IMDb: {movie.imdbRating || 'לא זמין'}</p>
                <Link to={`/movie/${movie.tmdbId}`} className="netflix-details-button">
                  פרטים
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;