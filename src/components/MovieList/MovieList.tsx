import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { movieStore } from "../../mobx/movieStore";
import { Card, Button, Row, Col } from "antd";
import "./MovieList.module.css";

const { Meta } = Card;

const MovieList: React.FC = observer(() => {
  // Состояния для редактирования фильма и нового названия
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  // Эффект для загрузки фильмов при первом рендере, если список пуст
  useEffect(() => {
    if (movieStore.movies.length < 1) {
      movieStore.loadMovies();
    }
  }, [movieStore.movies]);

  // Функция для начала редактирования фильма, устанавливает ID и текущее название
  const handleEditClick = (movieId: number, currentTitle: string) => {
    setEditingMovieId(movieId);
    setNewTitle(currentTitle);
  };

  // Функция для сохранения изменений названия фильма
  const handleSaveClick = (movieId: number) => {
    movieStore.editMovie(movieId, newTitle);
    setEditingMovieId(null); // Завершение режима редактирования
  };

  // Функция для удаления фильма по его ID
  const handleDeleteClick = (movieId: number) => {
    movieStore.deleteMovie(movieId);
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      {movieStore.movies.map((movie) => (
        <Col xs={24} sm={12} md={8} key={movie.id}>
          <Card
            hoverable
            cover={
              <img
                alt={movie.title}
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              />
            }
            className="movie-card"
          >
            {editingMovieId === movie.id ? (
              // Блок редактирования названия фильма
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Button
                  type="primary"
                  onClick={() => handleSaveClick(movie.id)}
                >
                  Save
                </Button>
                <Button onClick={() => setEditingMovieId(null)}>Cancel</Button>
              </div>
            ) : (
              // Отображение информации о фильме и кнопок управления
              <div>
                <Meta
                  title={movie.title}
                  description={`Release Date: ${movie.release_date}`}
                />
                <div className="movie-card-buttons">
                  <Button
                    onClick={() => handleEditClick(movie.id, movie.title)}
                    type="link"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(movie.id)} // Inline arrow function
                    type="link"
                    danger
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
      ))}
      {movieStore.isLoading && <p>Loading more movies...</p>}
    </Row>
  );
});

export default MovieList;
