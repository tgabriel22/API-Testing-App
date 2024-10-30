import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { movieStore } from "../../mobx/movieStore";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import "./MovieList.module.css";

const MovieList: React.FC = observer(() => {
  useEffect(() => {
    movieStore.loadMovies();
  }, []);
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  const handleEditClick = (movieId: number, currentTitle: string) => {
    setEditingMovieId(movieId);
    setNewTitle(currentTitle);
  };

  const handleSaveClick = (movieId: number) => {
    movieStore.editMovie(movieId, newTitle);
    setEditingMovieId(null);
  };

  const handleDeleteClick = (movieId: number) => {
    movieStore.deleteMovie(movieId);
  };

  useInfiniteScroll();

  return (
    <div className="movie-list">
      {movieStore.movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          {editingMovieId === movie.id ? (
            <>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button onClick={() => handleSaveClick(movie.id)}>Save</button>
              <button onClick={() => setEditingMovieId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{movie.title}</h3>
              <p>Release Date: {movie.release_date}</p>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <button onClick={() => handleEditClick(movie.id, movie.title)}>
                Edit
              </button>
              <button onClick={() => handleDeleteClick(movie.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
      {movieStore.isLoading && <p>Loading more movies...</p>}
    </div>
  );
});

export default MovieList;
