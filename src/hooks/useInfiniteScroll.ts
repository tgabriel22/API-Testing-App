import { useEffect } from "react";
import { movieStore } from "../mobx/movieStore";

export function useInfiniteScroll() {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (!movieStore.isLoading) {
          movieStore.loadMovies();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
