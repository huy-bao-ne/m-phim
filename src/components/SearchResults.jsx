import React from 'react';
import { motion } from 'framer-motion';
import MovieRow from './MovieRow';

// ========================================
// SEARCH RESULTS Component
// ========================================
const SearchResults = ({ searchQuery, searchResults, onMovieClick, myList, onToggleMyList }) => {
  if (!searchQuery) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen py-24 px-8 md:px-16"
    >
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Kết quả tìm kiếm cho "{searchQuery}"
        </h1>
        <p className="text-gray-400">
          Tìm thấy {searchResults.length} kết quả
        </p>
      </div>

      {/* Results */}
      {searchResults.length > 0 ? (
        <MovieRow
          title=""
          movies={searchResults}
          onMovieClick={onMovieClick}
          myList={myList}
          onToggleMyList={onToggleMyList}
        />
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 mb-2">
            Không tìm thấy kết quả nào
          </p>
          <p className="text-gray-500">
            Hãy thử từ khóa khác hoặc khám phá các phim được đề xuất
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;
