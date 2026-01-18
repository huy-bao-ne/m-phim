import { motion } from 'framer-motion';

const Top10Section = ({ movies, onMovieClick }) => {
  // Lấy top 10 movies với rating cao nhất
  const top10Movies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <div className="px-8 md:px-16 mb-16">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Top 10
        </span>
        <span className="text-white">Movies This Week</span>
      </h2>

      <div className="relative">
        <div className="flex gap-3 overflow-x-scroll scrollbar-hide pb-8">
          {top10Movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onMovieClick(movie)}
              className="relative flex-shrink-0 cursor-pointer group"
            >
              {/* Container */}
              <div className="flex gap-2 items-end">
                {/* HUGE Rank Number */}
                <div className="flex items-end pb-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="text-[140px] font-black leading-none select-none"
                    style={{
                      WebkitTextStroke: '2px #06B6D4',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                    }}
                  >
                    {index + 1}
                  </motion.span>
                </div>

                {/* Movie Poster */}
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 50 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-36 aspect-[2/3] rounded-lg overflow-hidden shadow-xl"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-yellow-400">★ {movie.rating}</span>
                        <span className="text-gray-300">• {movie.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{index + 1}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top10Section;
