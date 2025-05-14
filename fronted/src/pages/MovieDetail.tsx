import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById, addMovie } from '../services/movies';
import { type Movie } from '../types/movie';
import '../styles/movie-detail.css';
import '../styles/movie-card.css';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'WANT_TO_WATCH' | 'WATCHED'>('WANT_TO_WATCH');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id!);
        setMovie(movieData);
      } catch (err: any) {
        setError(err.response?.data.message || 'טעינת פרטי הסרט נכשלה');
      }
    };
    fetchMovie();
  }, [id]);

  const handleAdd = async () => {
    if (!movie) return;
    try {
      await addMovie({
        tmdbId: movie.tmdbId,
        title: movie.title,
        releaseYear: movie.releaseYear,
        poster: movie.poster,
        imdbRating: movie.imdbRating,
        status,
      });
      alert('הסרט נוסף למרחב שלך!');
    } catch (err: any) {
      setError(err.response?.data.message || 'הוספת הסרט נכשלה');
    }
  };

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        {error && <p className="error">{error}</p>}
        {!movie && !error && <p className="loading">טוען...</p>}
        {movie && (
          <>
            <h2>{movie.title}</h2>
            <div className="movie-detail-content">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-detail-poster"
                />
              ) : (
                <div className="movie-detail-poster"></div>
              )}
              <div className="movie-detail-info">
                <p><strong>שנה:</strong> {movie.releaseYear || 'לא זמין'}</p>
                <p><strong>דירוג IMDb:</strong> {movie.imdbRating || 'לא זמין'}</p>
                <div className="form-group">
                  <label htmlFor="status">סטטוס:</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'WANT_TO_WATCH' | 'WATCHED')}
                    className="status-select"
                  >
                    <option value="WANT_TO_WATCH">רוצה לצפות</option>
                    <option value="WATCHED">נצפה</option>
                  </select>
                </div>
                <button onClick={handleAdd}>הוסף למרחב שלי</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;