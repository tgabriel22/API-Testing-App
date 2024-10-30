import { makeAutoObservable, runInAction } from "mobx";
import { fetchMovies } from "../assets/services/api";

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

class MovieStore {
  movies: Movie[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
  hasMore: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.setupInfiniteScroll();
  }

  async loadMovies() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    try {
      const newMovies = await fetchMovies(this.currentPage);

      runInAction(() => {
        this.movies = [...this.movies, ...newMovies];
        this.currentPage++;
        this.hasMore = newMovies.length > 0;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  setupInfiniteScroll() {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !this.isLoading &&
        this.hasMore
      ) {
        this.loadMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }

  // Edit a movie by its ID
  editMovie(id: number, newTitle: string) {
    const movie = this.movies.find((movie) => movie.id === id);
    if (movie) {
      movie.title = newTitle;
    }
  }

  // Delete a movie by its ID
  deleteMovie(id: number) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }
}

export const movieStore = new MovieStore();
