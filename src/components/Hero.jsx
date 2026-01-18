import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomMovie, movieData } from '../data/movieData';

const Hero = ({ onMovieClick, currentUser }) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // Lấy 5 phim ngẫu nhiên cho carousel
    const featuredMovies = [];
    const allMovies = movieData;
    const usedIndices = new Set();
    
    while (featuredMovies.length < Math.min(5, allMovies.length)) {
      const randomIndex = Math.floor(Math.random() * allMovies.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        featuredMovies.push(allMovies[randomIndex]);
      }
    }
    
    setMovies(featuredMovies);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000); // Chuyển sau 6 giây

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (movies.length === 0) {
    return (
      <div className="h-screen bg-gray-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const movie = movies[currentIndex];

  // Truncate description
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ========================================
          ANIMATED BACKGROUND với Carousel Transition
      ======================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${movie.backdropUrl})`,
          }}
        >
          {/* Cyan-Purple gradient overlay cho unique look */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
          {/* Neon accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        </motion.div>
      </AnimatePresence>

      {/* ========================================
          NAVIGATION BUTTONS
      ======================================== */}
      <button
        onClick={handlePrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/20 transition group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/20 transition group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition" />
      </button>

      {/* ========================================
          CONTENT SECTION với Animation
      ======================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
          className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl z-10"
        >
          {/* Title với Animation */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Movie Meta Info với Neon Tags */}
          <div className="flex items-center gap-4 mb-6 text-sm md:text-base">
            {currentUser ? (
              <span className="text-primary font-bold text-xl neon-pulse">{movie.rating}% Match</span>
            ) : (
              <span className="text-yellow-400 font-bold text-xl">⭐ {movie.rating / 10}/10</span>
            )}
            <span className="glass px-3 py-1 rounded-full">{movie.year}</span>
            <span className="glass border border-primary/50 px-3 py-1 rounded-full">{movie.maturityRating}</span>
            <span className="text-gray-300">{movie.seasons ? `${movie.seasons} Seasons` : movie.duration}</span>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg max-w-2xl leading-relaxed mb-8 drop-shadow-lg">
            {truncateText(movie.description, 200)}
          </p>

          {/* ========================================
              ACTION BUTTONS với Hover Effects
          ======================================== */}
          <div className="flex gap-4">
            {/* Play Button với Gradient */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMovieClick && onMovieClick(movie);
              }}
              className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 text-lg shadow-neon"
            >
              <Play size={24} fill="white" />
              Phát ngay
            </motion.button>

            {/* More Info Button với Glass Effect */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMovieClick && onMovieClick(movie);
              }}
              className="glass text-white px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 text-lg border border-primary/30"
            >
              <Info size={24} />
              Chi tiết
            </motion.button>
          </div>

          {/* Genre Tags với Neon Border */}
          <div className="flex gap-2 mt-6">
            {movie.genre.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="text-xs px-4 py-2 glass rounded-full border border-primary/30 hover:border-primary/60 transition cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ========================================
          DOTS INDICATOR
      ======================================== */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/50'
                : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Hero;
