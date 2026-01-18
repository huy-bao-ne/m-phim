import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Info, Sparkles } from 'lucide-react';

const SpotlightSection = ({ movies, onMovieClick, myList, onToggleMyList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const spotlightMovies = movies; // Không cần slice nữa vì đã slice ở App.jsx

  useEffect(() => {
    if (spotlightMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightMovies.length);
    }, 8000); // Đổi phim mỗi 8 giây

    return () => clearInterval(interval);
  }, [spotlightMovies.length]);

  const currentMovie = spotlightMovies[currentIndex];
  const isInMyList = myList?.some(m => m.id === currentMovie?.id) || false;

  if (!currentMovie || spotlightMovies.length === 0) return null;

  return (
    <div className="relative px-4 md:px-8 lg:px-16 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Editor's Spotlight
        </h2>
      </div>

      {/* Main Spotlight Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden group"
        >
          {/* Background Image with Gradient */}
          <div className="relative h-[400px] md:h-[500px]">
            {/* Gradient Background Fallback */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
            
            <img
              src={currentMovie.backdropUrl || currentMovie.posterUrl}
              alt={currentMovie.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              onLoad={(e) => {
                e.target.style.opacity = '1';
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            
            {/* Multiple Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/80" />
            
            {/* Animated Spotlight Effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary 
                            px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">Featured Pick</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-2xl">
                {currentMovie.title}
              </h3>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-white/90">
                <span className="text-primary font-bold">{currentMovie.rating}/10</span>
                <span>•</span>
                <span>{currentMovie.year}</span>
                <span>•</span>
                <span>{currentMovie.duration}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs">{currentMovie.category}</span>
              </div>

              {/* Description */}
              <p className="text-white/80 text-sm md:text-base max-w-2xl mb-6 line-clamp-2">
                {currentMovie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMovieClick(currentMovie)}
                  className="flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-lg 
                           font-bold hover:bg-opacity-90 transition-all shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Phát Ngay</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMyList(currentMovie);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold 
                           transition-all shadow-lg ${
                    isInMyList
                      ? 'bg-primary text-white'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>{isInMyList ? 'Đã Thêm' : 'Danh Sách'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMovieClick(currentMovie)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white 
                           px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
                >
                  <Info className="w-5 h-5" />
                  <span>Chi Tiết</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {spotlightMovies.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-white/30'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: '0 0 0 2px transparent'
            }}
            animate={{
              boxShadow: [
                '0 0 0 2px rgba(6,182,212,0.5)',
                '0 0 0 2px rgba(139,92,246,0.5)',
                '0 0 0 2px rgba(236,72,153,0.5)',
                '0 0 0 2px rgba(6,182,212,0.5)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SpotlightSection;
