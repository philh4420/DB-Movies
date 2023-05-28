import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Movie from '../src/Movie';
import './App.css';

const API_KEY = 'e7811799fcbd2c5fe1c7eed7a7955b7d';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_POPULAR_MOVIES_URL = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
const API_POPULAR_TVSHOWS_URL = `${API_BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
const API_SEARCH_URL = `${API_BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPopularMovies();
    fetchPopularTVShows();
  }, []);

  const fetchPopularMovies = () => {
    fetch(API_POPULAR_MOVIES_URL)
      .then(response => response.json())
      .then(data => setMovies(prevMovies => ({ ...prevMovies, movies: data.results, searchType: '' })))
      .catch(error => console.log(error));
  };

  const fetchPopularTVShows = () => {
    fetch(API_POPULAR_TVSHOWS_URL)
      .then(response => response.json())
      .then(data => setMovies(prevMovies => ({ ...prevMovies, tvshows: data.results, searchType: '' })))
      .catch(error => console.log(error));
  };

  const handleSearchInput = e => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery === '') {
      fetchPopularMovies();
      fetchPopularTVShows();
    } else {
      const allSearchResults = [];
      let totalPages = 0;
      let currentPage = 1;

      const fetchSearchResults = () => {
        const url = `${API_SEARCH_URL}${searchQuery}&page=${currentPage}`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            allSearchResults.push(...data.results);

            if (currentPage === 1) {
              totalPages = data.total_pages;
            }

            if (currentPage < totalPages) {
              currentPage++;
              fetchSearchResults();
            } else {
              const searchResults = {
                movies: [],
                tvshows: [],
                searchType: 'search'
              };

              allSearchResults.forEach(item => {
                if (item.media_type === 'movie') {
                  searchResults.movies.push(item);
                } else if (item.media_type === 'tv') {
                  searchResults.tvshows.push(item);
                }
              });

              setMovies(searchResults);
            }
          })
          .catch(error => console.log(error));
      };

      fetchSearchResults();
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search for a movie or TV show..."
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {movies.searchType === '' && movies.movies && movies.movies.length > 0 && (
        <div>
          <h2 className="heading">Latest Movies</h2>
          <div className="movie-container">
            {movies.movies.map(movie => (
              <Movie key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      )}
      {movies.searchType === '' && movies.tvshows && movies.tvshows.length > 0 && (
        <div>
          <h2 className="heading">Latest TV Shows</h2>
          <div className="movie-container">
            {movies.tvshows.map(tvshow => (
              <Movie key={tvshow.id} {...tvshow} />
            ))}
          </div>
        </div>
      )}
      {movies.searchType === 'search' && (
        <div>
          <h2>Search Results</h2>
          {movies.movies && movies.movies.length > 0 && (
            <div>
              <h3>Movies</h3>
              <div className="movie-container">
                {movies.movies.map(movie => (
                  <Movie key={movie.id} {...movie} />
                ))}
              </div>
            </div>
          )}
          {movies.tvshows && movies.tvshows.length > 0 && (
            <div>
              <h3>TV Shows</h3>
              <div className="movie-container">
                {movies.tvshows.map(tvshow => (
                  <Movie key={tvshow.id} {...tvshow} />
                ))}
              </div>
            </div>
          )}
          {(movies.movies && movies.movies.length === 0 && movies.tvshows && movies.tvshows.length === 0) && (
            <p>No search results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string.isRequired,
  poster_path: PropTypes.string,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string,
};

export default App;
