import { useState, useEffect } from 'react';
import { getUserMovies, getFavoriteMovies, updateMovie, deleteMovie } from '../services/movies';
import { type Movie } from '../types/movie';
import '../styles/my-space.css';
import '../styles/movie-card.css';

const MySpace = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'WANT_TO_WATCH' | 'WATCHED' | 'FAVORITES'>('WANT_TO_WATCH');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const userMovies = await getUserMovies();
        const favoriteMovies = await getFavoriteMovies();
        setMovies(userMovies);
        setFavorites(favoriteMovies);
      } catch (err: any) {
        setError(err.response?.data.message || 'טעינת הסרטים נכשלה');
      }
    };
    fetchMovies();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Movie>) => {
    try {
      const updatedMovie = await updateMovie(id, updates);
      setMovies((prevMovies) =>
        prevMovies.map((movie) => (movie._id === id ? updatedMovie : movie))
      );
      if (updates.isFavorite !== undefined) {
        if (updates.isFavorite) {
          setFavorites((prevFavorites) => {
            if (!prevFavorites.some((movie) => movie._id === id)) {
              return [...prevFavorites, updatedMovie];
            }
            return prevFavorites.map((movie) =>
              movie._id === id ? updatedMovie : movie
            );
          });
        } else {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((movie) => movie._id !== id)
          );
        }
      }
    } catch (err: any) {
      setError(err.response?.data.message || 'עדכון הסרט נכשל');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      setFavorites((prevFavorites) => prevFavorites.filter((movie) => movie._id !== id));
    } catch (err: any) {
      setError(err.response?.data.message || 'מחיקת הסרט נכשלה');
    }
  };

  const filteredMovies = () => {
    if (activeTab === 'FAVORITES') return favorites;
    return movies.filter((movie) => movie.status === activeTab);
  };

  return (
    <div className="my-space-page">
      <div className="my-space-container">
        <h2>המרחב שלי</h2>
        <div className="tabs">
          <button
            className={activeTab === 'WANT_TO_WATCH' ? 'active' : ''}
            onClick={() => setActiveTab('WANT_TO_WATCH')}
          >
            רוצה לצפות
          </button>
          <button
            className={activeTab === 'WATCHED' ? 'active' : ''}
            onClick={() => setActiveTab('WATCHED')}
          >
            נצפה
          </button>
          <button
            className={activeTab === 'FAVORITES' ? 'active' : ''}
            onClick={() => setActiveTab('FAVORITES')}
          >
            מועדפים
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="netflix-movies-grid">
          {filteredMovies().length === 0 && <p className="no-movies">אין סרטים להצגה</p>}
          {filteredMovies().map((movie) => (
            <div key={movie._id} className="netflix-movie-card">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="netflix-movie-poster" />
              ) : (
                <div className="netflix-movie-poster"></div>
              )}
              <div className="netflix-movie-info">
                <h3>{movie.title}</h3>
                <p>שנה: {movie.releaseYear || 'לא זמין'}</p>
                <p>דירוג IMDb: {movie.imdbRating || 'לא זמין'}</p>
                <div className="form-group">
                  <label htmlFor={`status-${movie._id}`}>סטטוס:</label>
                  <select
                    id={`status-${movie._id}`}
                    value={movie.status || 'WANT_TO_WATCH'}
                    onChange={(e) =>
                      handleUpdate(movie._id!, {
                        status: e.target.value as 'WANT_TO_WATCH' | 'WATCHED',
                      })
                    }
                    className="status-select"
                  >
                    <option value="WANT_TO_WATCH">רוצה לצפות</option>
                    <option value="WATCHED">נצפה</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`rating-${movie._id}`}>דירוג:</label>
                  <input
                    type="number"
                    id={`rating-${movie._id}`}
                    min="1"
                    max="10"
                    value={movie.rating || ''}
                    onChange={(e) =>
                      handleUpdate(movie._id!, { rating: parseInt(e.target.value) })
                    }
                    className="rating-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`comments-${movie._id}`}>הערות:</label>
                  <textarea
                    id={`comments-${movie._id}`}
                    value={movie.comments || ''}
                    onChange={(e) => handleUpdate(movie._id!, { comments: e.target.value })}
                    className="comments-textarea"
                  />
                </div>
                <div className="form-group favorite-group">
                  <button
                    className={`netflix-favorite-button ${movie.isFavorite ? 'active' : ''}`}
                    onClick={() => handleUpdate(movie._id!, { isFavorite: !movie.isFavorite })}
                    title={movie.isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
                  >
                    <span className="star-icon">{movie.isFavorite ? '★' : '☆'}</span>
                    <span className="plus-icon">{movie.isFavorite ? '' : '+'}</span>
                  </button>
                </div>
                <button
                  className="netflix-delete-button"
                  onClick={() => handleDelete(movie._id!)}
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySpace;