import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { movieStore } from "../../mobx/movieStore";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import "./MovieList.module.css";

const MovieList: React.FC = observer(() => {
  useEffect(() => {
    movieStore.loadMovies();
  }, []);

  useInfiniteScroll();

  return (
    <div className="movie-list">
      {movieStore.movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <h3>{movie.title}</h3>
          <p>Release Date: {movie.release_date}</p>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      ))}
      {movieStore.isLoading && <p>Loading more movies...</p>}
    </div>
  );
});

export default MovieList;
