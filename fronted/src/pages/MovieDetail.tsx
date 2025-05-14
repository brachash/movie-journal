// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { searchMovies, addMovie } from '../services/movies';
// import { type Movie } from '../types/movie';

// const MovieDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [error, setError] = useState('');
//   const [status, setStatus] = useState<'WANT_TO_WATCH' | 'WATCHED'>('WANT_TO_WATCH');

//   useEffect(() => {
//     const fetchMovie = async () => {
//       try {
//         const results = await searchMovies(id!);
//         const foundMovie = results.find((m) => m.tmdbId === id);
//         if (foundMovie) {
//           setMovie(foundMovie);
//         } else {
//           setError('הסרט לא נמצא');
//         }
//       } catch (err: any) {
//         setError(err.response?.data.message || 'טעינת פרטי הסרט נכשלה');
//       }
//     };
//     fetchMovie();
//   }, [id]);

//   const handleAdd = async () => {
//     if (!movie) return;
//     try {
//       await addMovie({
//         tmdbId: movie.tmdbId,
//         title: movie.title,
//         releaseYear: movie.releaseYear,
//         poster: movie.poster,
//         imdbRating: movie.imdbRating,
//         status,
//       });
//       alert('הסרט נוסף למרחב שלך!');
//     } catch (err: any) {
//       setError(err.response?.data.message || 'הוספת הסרט נכשלה');
//     }
//   };

//   if (error) return <p className="error">{error}</p>;
//   if (!movie) return <p className="loading">טוען...</p>;

//   return (
//     <div className="movie-detail-container">
//       <h2>{movie.title}</h2>
//       <div className="movie-detail-content">
//         {movie.poster && (
//           <img
//             src={movie.poster}
//             alt={movie.title}
//             className="movie-detail-poster"
//           />
//         )}
//         <div className="movie-detail-info">
//           <p><strong>שנה:</strong> {movie.releaseYear || 'לא זמין'}</p>
//           <p><strong>דירוג IMDb:</strong> {movie.imdbRating || 'לא זמין'}</p>
//           <div className="form-group">
//             <label htmlFor="status">סטטוס:</label>
//             <select
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value as 'WANT_TO_WATCH' | 'WATCHED')}
//               className="status-select"
//             >
//               <option value="WANT_TO_WATCH">רוצה לצפות</option>
//               <option value="WATCHED">נצפה</option>
//             </select>
//           </div>
//           <button onClick={handleAdd}>הוסף למרחב שלי</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetail;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById, addMovie } from '../services/movies';
import {type Movie } from '../types/movie';

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

  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="loading">טוען...</p>;

  return (
    <div className="movie-detail-container">
      <h2>{movie.title}</h2>
      <div className="movie-detail-content">
        {movie.poster && (
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-detail-poster"
          />
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
    </div>
  );
};

export default MovieDetail;