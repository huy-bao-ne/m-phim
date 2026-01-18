// Generate personalized recommendations based on user's watch history and preferences

export const getRecommendationsByHistory = (watchHistory, allMovies, limit = 10) => {
  if (!watchHistory || watchHistory.length === 0) {
    return [];
  }

  // Get genres and categories from watch history
  const watchedMovies = watchHistory.map(item => item.movie);
  const watchedGenres = new Set();
  const watchedCategories = new Set();
  const watchedMovieIds = new Set();

  watchedMovies.forEach(movie => {
    watchedMovieIds.add(movie.id);
    if (movie.genre) {
      movie.genre.forEach(g => watchedGenres.add(g));
    }
    if (movie.category) {
      watchedCategories.add(movie.category);
    }
  });

  // Score each unwatched movie
  const recommendations = allMovies
    .filter(movie => !watchedMovieIds.has(movie.id))
    .map(movie => {
      let score = 0;
      
      // Genre matching (most important)
      if (movie.genre) {
        const matchingGenres = movie.genre.filter(g => watchedGenres.has(g)).length;
        score += matchingGenres * 3;
      }
      
      // Category matching
      if (movie.category && watchedCategories.has(movie.category)) {
        score += 2;
      }
      
      // Rating bonus
      score += (movie.rating / 100) * 1;
      
      return { movie, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);

  return recommendations;
};

export const getBecauseYouWatchedRows = (watchHistory, allMovies) => {
  if (!watchHistory || watchHistory.length === 0) {
    return [];
  }

  const rows = [];
  const processedMovies = new Set();

  // Get up to 3 most recent watched movies
  const recentWatched = watchHistory.slice(0, 3);

  recentWatched.forEach(({ movie: watchedMovie }) => {
    const recommendations = allMovies
      .filter(movie => {
        // Exclude the watched movie itself and already processed
        if (movie.id === watchedMovie.id || processedMovies.has(movie.id)) {
          return false;
        }

        // Must share at least one genre
        const sharedGenres = movie.genre?.filter(g => 
          watchedMovie.genre?.includes(g)
        ) || [];
        
        return sharedGenres.length > 0;
      })
      .map(movie => {
        // Calculate similarity score
        let score = 0;
        
        // Genre matching
        const sharedGenres = movie.genre?.filter(g => 
          watchedMovie.genre?.includes(g)
        ).length || 0;
        score += sharedGenres * 5;
        
        // Same category bonus
        if (movie.category === watchedMovie.category) {
          score += 3;
        }
        
        // Rating similarity
        const ratingDiff = Math.abs(movie.rating - watchedMovie.rating);
        score += (100 - ratingDiff) / 20;
        
        return { movie, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.movie);

    if (recommendations.length >= 3) {
      recommendations.forEach(m => processedMovies.add(m.id));
      rows.push({
        title: `Because You Watched "${watchedMovie.title}"`,
        movies: recommendations,
        sourceMovie: watchedMovie
      });
    }
  });

  return rows;
};

export const getTopRatedForUser = (watchHistory, myList, allMovies, limit = 10) => {
  const watchedGenres = new Set();
  const watchedCategories = new Set();
  const excludeIds = new Set();

  // Collect preferences from watch history
  if (watchHistory) {
    watchHistory.forEach(item => {
      excludeIds.add(item.movie.id);
      if (item.movie.genre) {
        item.movie.genre.forEach(g => watchedGenres.add(g));
      }
      if (item.movie.category) {
        watchedCategories.add(item.movie.category);
      }
    });
  }

  // Collect preferences from my list
  if (myList) {
    myList.forEach(movie => {
      excludeIds.add(movie.id);
      if (movie.genre) {
        movie.genre.forEach(g => watchedGenres.add(g));
      }
      if (movie.category) {
        watchedCategories.add(movie.category);
      }
    });
  }

  // If no preferences, return top rated overall
  if (watchedGenres.size === 0 && watchedCategories.size === 0) {
    return allMovies
      .filter(m => !excludeIds.has(m.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Return top rated movies matching preferences
  return allMovies
    .filter(movie => {
      if (excludeIds.has(movie.id)) return false;
      
      const hasMatchingGenre = movie.genre?.some(g => watchedGenres.has(g));
      const hasMatchingCategory = watchedCategories.has(movie.category);
      
      return hasMatchingGenre || hasMatchingCategory;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getNewReleasesForUser = (watchHistory, allMovies, limit = 10) => {
  const watchedGenres = new Set();
  const excludeIds = new Set();

  if (watchHistory) {
    watchHistory.forEach(item => {
      excludeIds.add(item.movie.id);
      if (item.movie.genre) {
        item.movie.genre.forEach(g => watchedGenres.add(g));
      }
    });
  }

  // Get newest movies (by year)
  const newReleases = allMovies
    .filter(movie => !excludeIds.has(movie.id))
    .sort((a, b) => b.year - a.year)
    .slice(0, 20); // Get top 20 newest

  // If user has preferences, prioritize matching genres
  if (watchedGenres.size > 0) {
    return newReleases
      .map(movie => {
        const matchingGenres = movie.genre?.filter(g => watchedGenres.has(g)).length || 0;
        return { movie, score: matchingGenres };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.movie);
  }

  return newReleases.slice(0, limit);
};
