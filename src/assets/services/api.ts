// Define the base URL and API key
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Load from .env

// Function to fetch movies from the TMDb API
export async function fetchMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error(error);
    return [];
  }
}
