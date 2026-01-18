import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Info, Volume2, VolumeX } from 'lucide-react';

const MovieCard = ({ movie, onMovieClick, isInMyList, onToggleMyList, currentUser }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  // Delay before showing preview
  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 800); // 800ms delay like Netflix
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // Auto-play video when preview shows
  useEffect(() => {
    if (showPreview && videoRef.current && movie.videoUrl) {
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked
      });
    }
  }, [showPreview, movie.videoUrl]);

  // Clean up
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    // Navigate to video player (will be implemented)
    onMovieClick(movie);
  };

  const handleToggleMyList = (e) => {
    e.stopPropagation();
    onToggleMyList(movie);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    onMovieClick(movie);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(139,92,246,0.4) 50%, transparent 70%)',
          transform: 'scale(1.2)',
          zIndex: -1
        }}
      />

      {/* Normal poster view */}
      <motion.div
        className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl"
        animate={{
          scale: isHovered ? 1.05 : 1,
          zIndex: isHovered ? 10 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Poster image */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Video preview (only if available and hovered long enough) */}
        <AnimatePresence>
          {showPreview && movie.videoUrl && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <video
                ref={videoRef}
                src={movie.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />
              
              {/* Video controls */}
              <div className="absolute bottom-2 right-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3 z-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {/* Title */}
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-1">
                {movie.title}
              </h3>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {/* Play button */}
                <button
                  onClick={handlePlayClick}
                  className="p-1.5 bg-white rounded-full hover:scale-110 transition-transform"
                  title="Phát"
                >
                  <Play className="w-4 h-4 text-dark fill-dark" />
                </button>

                {/* Add to My List button */}
                {currentUser && (
                  <button
                    onClick={handleToggleMyList}
                    className="p-1.5 bg-dark/80 border-2 border-white/50 rounded-full hover:scale-110 hover:border-white transition-all"
                    title={isInMyList ? 'Xóa khỏi danh sách' : 'Thêm vào danh sách'}
                  >
                    {isInMyList ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}

                {/* Info button */}
                <button
                  onClick={handleInfoClick}
                  className="p-1.5 bg-dark/80 border-2 border-white/50 rounded-full hover:scale-110 hover:border-white transition-all ml-auto"
                  title="Thông tin"
                >
                  <Info className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Match percentage or Rating */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                {currentUser ? (
                  <span className="text-primary font-bold">
                    {movie.rating}% Match
                  </span>
                ) : (
                  <span className="text-yellow-400 font-bold">
                    ⭐ {movie.rating / 10}/10
                  </span>
                )}
                <span className="text-white/60">• {movie.year}</span>
                <span className="px-1 py-0.5 border border-white/40 text-white/80 text-[10px]">
                  {movie.maturityRating}
                </span>
              </div>

              {/* Genres */}
              <div className="mt-1 flex flex-wrap gap-1">
                {movie.genre.slice(0, 2).map((genre, idx) => (
                  <span key={idx} className="text-white/60 text-[10px]">
                    {genre}
                    {idx < Math.min(movie.genre.length, 2) - 1 && ' •'}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shadow effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-lg shadow-neon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieCard;
