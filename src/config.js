// ================================
// TMDB API CONFIGURATION
// ================================
// Hướng dẫn: Thay thế 'YOUR_TMDB_API_KEY_HERE' bằng API key của bạn từ https://www.themoviedb.org/settings/api

const config = {
  // API Key - QUAN TRỌNG: Điền API key của bạn vào đây
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
  
  // Base URLs
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // Image sizes
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'original',
  
  // Language
  LANGUAGE: 'vi-VN', // Tiếng Việt
};

export default config;
