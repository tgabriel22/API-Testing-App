import { makeAutoObservable, runInAction } from "mobx";
import { fetchMovies } from "../assets/services/api";

// Определение интерфейса Movie для типизации свойств фильма
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

class MovieStore {
  movies: Movie[] = []; // Массив фильмов
  currentPage: number = 1; // Текущая страница для пагинации
  isLoading: boolean = false; // Флаг загрузки данных
  hasMore: boolean = true; // Флаг наличия дополнительных данных

  constructor() {
    makeAutoObservable(this); // Автоматическое отслеживание изменений
    this.setupInfiniteScroll(); // Инициализация бесконечной прокрутки
  }

  // Метод для загрузки фильмов с сервера
  async loadMovies() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true; // Установка флага загрузки
    try {
      const newMovies = await fetchMovies(this.currentPage); // Запрос новых фильмов

      runInAction(() => {
        // Обновление состояния с новыми фильмами
        this.movies = [...this.movies, ...newMovies];
        this.currentPage++; // Увеличение страницы для следующего запроса
        this.hasMore = newMovies.length > 0; // Обновление флага наличия данных
      });
    } finally {
      runInAction(() => {
        this.isLoading = false; // Сброс флага загрузки после завершения
      });
    }
  }
  // Установка функции бесконечной прокрутки
  setupInfiniteScroll() {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !this.isLoading &&
        this.hasMore
      ) {
        this.loadMovies(); // Вызов loadMovies при достижении конца страницы
      }
    };
    // Добавление обработчика события прокрутки
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Удаление обработчика при размонтировании
  }

  // Метод для редактирования фильма по его ID
  editMovie(id: number, newTitle: string) {
    const movie = this.movies.find((movie) => movie.id === id);
    if (movie) {
      movie.title = newTitle; // Обновление названия фильма
    }
  }

  // Метод для удаления фильма по его ID
  deleteMovie(id: number) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }
}

export const movieStore = new MovieStore();
