import React from 'react';
import PropTypes from 'prop-types';

const Movie = ({ title, poster_path, overview, vote_average, release_date }) => {
  // Define default poster image URL in case poster_path is not provided
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Poster+Available';

  // Convert vote_average to a 5-star rating scale
  const rating = Math.round(vote_average / 2);

  // Format release_date to display only the year
  const year = release_date ? release_date.slice(0, 4) : '';

  return (
    <div className="movie">
      <div className="movie-poster-container">
        <img className="movie-poster" src={posterUrl} alt={title} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-details">
          <span className="movie-year">{year}</span>
          <span className={`movie-rating movie-rating-${rating}`}>{rating}</span>
        </div>
        <p className="movie-overview">{overview}</p>
      </div>
    </div>
  );
};

// Define prop types for Movie component
Movie.propTypes = {
  title: PropTypes.string.isRequired,
  poster_path: PropTypes.string,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string
};

export default Movie;
