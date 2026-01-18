import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Star } from 'lucide-react';

const TrendingBanner = ({ movies, onMovieClick }) => {
  const trendingMovie = movies[0]; // Lấy phim đầu tiên làm trending

  if (!trendingMovie) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-4 md:mx-8 lg:mx-16 mt-8 mb-12 rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => onMovieClick(trendingMovie)}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-80 animate-gradient-x" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Animated Flame Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-white/10 backdrop-blur-sm p-4 rounded-full"
          >
            <Flame className="w-8 h-8 text-white" />
          </motion.div>

          {/* Text Content */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm md:text-base uppercase tracking-wider">
                Trending Now
              </span>
            </div>
            <h3 className="text-white text-xl md:text-3xl font-bold mb-1">
              {trendingMovie.title}
            </h3>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {trendingMovie.rating}/10
              </span>
              <span>•</span>
              <span>{trendingMovie.year}</span>
              <span>•</span>
              <span>{trendingMovie.duration}</span>
            </div>
          </div>
        </div>

        {/* Watch Now Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-lg font-bold
                     hover:bg-opacity-90 transition-all shadow-lg"
        >
          <span>Xem Ngay</span>
        </motion.button>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 border-2 border-white/30 rounded-2xl"
        animate={{
          borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
    </motion.div>
  );
};

export default TrendingBanner;
