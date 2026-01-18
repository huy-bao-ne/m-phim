import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

const ContinueWatchingSection = ({ watchHistory, onMovieClick, onRemoveFromHistory }) => {
  if (!watchHistory || watchHistory.length === 0) {
    return null;
  }

  return (
    <div className="px-8 md:px-16 mb-12">
      <h2 className="text-2xl font-semibold mb-4 hover:text-gray-300 transition cursor-pointer">
        Continue Watching
      </h2>

      <div className="relative">
        <div className="flex gap-4 overflow-x-scroll scrollbar-hide pb-8">
          {watchHistory.map((item, index) => {
            const progress = item.progress || 0; // 0-100

            return (
              <motion.div
                key={item.movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  {/* Backdrop Image */}
                  <img
                    src={item.movie.backdropUrl}
                    alt={item.movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onMovieClick(item.movie)}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center"
                      >
                        <Play size={28} fill="white" className="text-white ml-1" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromHistory(item.movie.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Movie Info */}
                <div className="mt-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-primary transition">
                    {item.movie.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {progress}% completed
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingSection;
