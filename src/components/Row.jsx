import React, { useState, useEffect } from 'react';
import { getPosterUrl } from '../api';

const Row = ({ title, fetchFunction, isLargeRow = false }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchFunction();
      setMovies(data);
      setIsLoading(false);
    };

    fetchData();
  }, [fetchFunction]);

  return (
    <div className="px-8 md:px-16 mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 bg-gray-800 rounded animate-pulse ${
                isLargeRow ? 'h-80 w-56' : 'h-40 w-72'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-scroll overflow-y-hidden scrollbar-hide pb-4">
          {movies.map((movie) => {
            const posterUrl = getPosterUrl(movie.poster_path);
            
            if (!posterUrl) return null;

            return (
              <div
                key={movie.id}
                className="flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={posterUrl}
                  alt={movie.title || movie.name}
                  className={`rounded ${
                    isLargeRow ? 'h-80 w-56' : 'h-40 w-72'
                  } object-cover`}
                  loading="lazy"
                />
                {isLargeRow && (
                  <p className="text-sm mt-2 text-center truncate w-56">
                    {movie.title || movie.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Row;
