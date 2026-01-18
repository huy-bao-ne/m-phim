import React, { useState, useEffect } from 'react';
import { getTrending, getBackdropUrl, truncate } from '../api';

const Banner = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Lấy phim trending và chọn ngẫu nhiên một phim làm banner
    const fetchData = async () => {
      const trendingMovies = await getTrending();
      if (trendingMovies.length > 0) {
        // Chọn phim ngẫu nhiên từ danh sách trending
        const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
        setMovie(randomMovie);
      }
    };

    fetchData();
  }, []);

  if (!movie) {
    return (
      <header className="h-[600px] bg-gray-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </header>
    );
  }

  const backgroundImage = getBackdropUrl(movie.backdrop_path);

  return (
    <header
      className="relative h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {movie.title || movie.name}
        </h1>
        
        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="bg-white text-black px-8 py-2 rounded font-semibold hover:bg-gray-200 transition flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Phát
          </button>
          <button className="bg-gray-500/70 text-white px-8 py-2 rounded font-semibold hover:bg-gray-500/50 transition flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông tin khác
          </button>
        </div>

        {/* Description */}
        <p className="text-lg max-w-2xl leading-relaxed drop-shadow-md">
          {truncate(movie.overview, 200)}
        </p>
      </div>
    </header>
  );
};

export default Banner;
