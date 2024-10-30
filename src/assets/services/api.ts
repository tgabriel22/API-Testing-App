// Определение базового URL и API ключа
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Загрузка API ключа из .env

// Функция для получения списка фильмов из TMDb API
export async function fetchMovies(page: number = 1) {
  try {
    // Выполнение запроса к API с указанием страницы
    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      // Проверка успешности запроса и выброс ошибки при сбое
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    // Преобразование ответа в JSON формат
    const data = await response.json();
    return data.results; // Возвращение массива фильмов
  } catch (error) {
    console.error(error); // Вывод ошибки в консоль
    return []; // Возврат пустого массива при ошибке
  }
}
