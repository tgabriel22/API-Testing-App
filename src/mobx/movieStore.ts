import { makeAutoObservable } from "mobx";
import { fetchMovies } from "../assets/services/api";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}
class MovieStore {
  movies: Movie[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Action to fetch movies
  async loadMovies() {
    this.isLoading = true;
    const newMovies = await fetchMovies(this.currentPage);
    // console.log("Fetched movies again:", newMovies);
    this.movies = [...this.movies, ...newMovies];
    this.currentPage++;
    this.isLoading = false;
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
