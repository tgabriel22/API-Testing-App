import { makeAutoObservable } from "mobx";
import { fetchMovies } from "../assets/services/api";

class MovieStore {
  movies: any[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Action to fetch movies
  async loadMovies() {
    this.isLoading = true;
    const newMovies = await fetchMovies(this.currentPage);
    this.movies = [...this.movies, ...newMovies];
    this.currentPage++;
    this.isLoading = false;
  }
}

export const movieStore = new MovieStore();
