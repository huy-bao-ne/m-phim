import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronDown, Check } from 'lucide-react';

// ========================================
// MOVIECARD Component - Với trailer preview on hover
// ========================================
const MovieCard = ({ movie, onMovieClick, isInMyList, onToggleMyList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const hoverTimeoutRef = React.useRef(null);

  const handleHoverStart = () => {
    setIsHovered(true);
    // Auto-play trailer sau 2 giây hover
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTrailer(true);
    }, 2000);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setShowTrailer(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{
        width: '280px',
        height: '158px',
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          zIndex: isHovered ? 50 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
        className="relative w-full h-full rounded-lg overflow-hidden"
        style={{
          boxShadow: isHovered ? '0 0 30px rgba(139, 92, 246, 0.6)' : 'none'
        }}
      >
        {/* Main Image hoặc Trailer */}
        {showTrailer && movie.videoUrl ? (
          <iframe
            src={`${movie.videoUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1`}
            className="w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            title={movie.title}
          />
        ) : (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end p-3"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%)'
              }}
            >
              {/* Title */}
              <h3 className="font-bold text-sm mb-2 line-clamp-2 text-white leading-tight">
                {movie.title}
              </h3>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Play size={12} fill="white" color="white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMyList(movie);
                  }}
                  className="w-7 h-7 border border-primary rounded-full flex items-center justify-center flex-shrink-0"
                >
                  {isInMyList ? (
                    <Check size={12} color="#06B6D4" />
                  ) : (
                    <Plus size={12} color="#06B6D4" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMovieClick(movie);
                  }}
                  className="w-7 h-7 border border-white/50 rounded-full flex items-center justify-center flex-shrink-0 ml-auto"
                >
                  <ChevronDown size={12} color="white" />
                </motion.button>
              </div>

              {/* Info - Always visible */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-primary font-bold text-xs">{movie.rating}%</span>
                <span className="border border-white/40 px-2 py-0.5 rounded text-[10px]">
                  {movie.maturityRating}
                </span>
                <span className="text-gray-300 text-[10px]">{movie.duration}</span>
              </div>

              {/* Genres */}
              <div className="text-[10px] text-gray-400 line-clamp-1">
                {movie.genre.slice(0, 3).join(' • ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ========================================
// MOVIEROW Component - Container cho cards
// ========================================
const MovieRow = ({ title, movies, onMovieClick, myList, onToggleMyList }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="px-8 md:px-16 mb-12">
      {/* Row Title */}
      <h2 className="text-2xl font-semibold mb-4 hover:text-gray-300 transition cursor-pointer">
        {title}
      </h2>

      {/* ========================================
          MOVIE CARDS CONTAINER
          Logic: Khi hover card, đẩy cards bên cạnh ra xa
      ======================================== */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-scroll overflow-y-visible scrollbar-hide pb-12 pt-4 pl-4">
          {movies.map((movie, index) => {
            // Tính toán khoảng cách đẩy dựa trên vị trí
            let translateX = 0;
            if (hoveredIndex !== null) {
              if (index > hoveredIndex) {
                // Cards bên phải - đẩy sang phải
                translateX = 140;
              } else if (index < hoveredIndex) {
                // Cards bên trái - đẩy nhẹ sang trái để tạo space
                translateX = -20;
              } else if (index === hoveredIndex && index === 0) {
                // Card đầu tiên khi hover - đẩy sang phải một chút để có space scale
                translateX = 20;
              }
            }

            const isInMyList = myList.some((m) => m.id === movie.id);

            return (
              <motion.div
                key={movie.id}
                animate={{
                  x: translateX,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <MovieCard
                  movie={movie}
                  onMovieClick={onMovieClick}
                  isInMyList={isInMyList}
                  onToggleMyList={onToggleMyList}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
