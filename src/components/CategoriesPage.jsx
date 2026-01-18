import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/movieData';
import { ChevronLeft } from 'lucide-react';

const CategoriesPage = ({ movies, onMovieClick, myList, onToggleMyList, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // rating, year, title

  // Filter movies by category
  const filteredMovies = selectedCategory === 'all' 
    ? movies 
    : movies.filter(movie => movie.category === selectedCategory);

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="min-h-screen bg-dark pt-20 pb-12">
      {/* Header */}
      <div className="px-8 md:px-16 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Browse by Genre
        </h1>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50'
                : 'glass text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All ({movies.length})
          </button>
          {categories.map((category) => {
            const count = movies.filter(m => m.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50'
                    : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass px-4 py-2 rounded-lg text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="rating">Rating</option>
            <option value="year">Year</option>
            <option value="title">Title</option>
          </select>
          <span className="text-gray-500 ml-auto">
            {sortedMovies.length} {sortedMovies.length === 1 ? 'movie' : 'movies'}
          </span>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-8 md:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedMovies.map((movie, index) => {
            const isInMyList = myList.some(m => m.id === movie.id);
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onMovieClick(movie)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-yellow-400">★ {movie.rating}</span>
                        <span>•</span>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                  {isInMyList && (
                    <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {sortedMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No movies found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
