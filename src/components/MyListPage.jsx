import React from 'react';
import { motion } from 'framer-motion';
import MovieRow from './MovieRow';

// ========================================
// MY LIST PAGE Component
// ========================================
const MyListPage = ({ myList, onMovieClick, onToggleMyList }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-24 px-8 md:px-16"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Danh sách của tôi
        </h1>
        <p className="text-gray-400">
          {myList.length > 0 
            ? `Bạn có ${myList.length} phim trong danh sách` 
            : 'Danh sách của bạn đang trống'}
        </p>
      </div>

      {/* My List Movies */}
      {myList.length > 0 ? (
        <MovieRow
          title=""
          movies={myList}
          onMovieClick={onMovieClick}
          myList={myList}
          onToggleMyList={onToggleMyList}
        />
      ) : (
        <div className="text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <p className="text-2xl text-gray-400 mb-4">
              Bạn chưa có phim nào trong danh sách
            </p>
            <p className="text-gray-500 mb-8">
              Nhấn nút "+" trên bất kỳ phim nào để thêm vào danh sách của bạn
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold shadow-neon"
            >
              Khám phá phim
            </motion.button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyListPage;
