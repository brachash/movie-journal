import { useState, useEffect } from 'react';
import { getFavoriteMovies, updateMovie, deleteMovie } from '../services/movies';
import { type Movie } from '../types/movie';

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteMovies = await getFavoriteMovies();
        setFavorites(favoriteMovies);
      } catch (err: any) {
        setError(err.response?.data.message || 'טעינת המועדפים נכשלה');
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id: string) => {
    try {
      const updatedMovie = await updateMovie(id, { isFavorite: false });
      setFavorites(favorites.filter((movie) => movie._id !== id));
      alert('הסרט הוסר מהמועדפים');
    } catch (err: any) {
      setError(err.response?.data.message || 'הסרת המועדף נכשלה');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      setFavorites(favorites.filter((movie) => movie._id !== id));
      alert('הסרט נמחק');
    } catch (err: any) {
      setError(err.response?.data.message || 'מחיקת הסרט נכשלה');
    }
  };

  return (
    <div className="favorites-container">
      <h2>המועדפים שלי</h2>
      {error && <p className="error">{error}</p>}
      <div className="movies-grid">
        {favorites.length === 0 && <p>אין סרטים מועדפים להצגה</p>}
        {favorites.map((movie) => (
          <div key={movie._id} className="movie-card">
            {movie.poster && (
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
            )}
            <h3>{movie.title}</h3>
            <p>שנה: {movie.releaseYear || 'לא זמין'}</p>
            <p>דירוג IMDb: {movie.imdbRating || 'לא זמין'}</p>
            <p>סטטוס: {movie.status === 'WANT_TO_WATCH' ? 'רוצה לצפות' : 'נצפה'}</p>
            {movie.rating && <p>דירוג שלי: {movie.rating}/10</p>}
            {movie.comments && <p>הערות: {movie.comments}</p>}
            <button
              className="remove-favorite-button"
              onClick={() => handleRemoveFavorite(movie._id!)}
            >
              הסר ממועדפים
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(movie._id!)}
            >
              מחק
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;