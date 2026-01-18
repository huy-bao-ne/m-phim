import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX, Check, Star, Clock, Calendar, Film } from 'lucide-react';

// ========================================
// MODAL Component - Chi tiết phim với tabs
// ========================================
const MovieModal = ({ movie, isOpen, onClose, isInMyList, onToggleMyList, currentUser, onWatchNow }) => {
  const [isMuted, setIsMuted] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('overview');

  // ========================================
  // LOGIC: Ngăn scroll khi modal mở
  // ========================================
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ========================================
              BACKDROP OVERLAY - Click để đóng
          ======================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 overflow-y-auto flex items-start justify-center pt-10 pb-10"
          >
            {/* ========================================
                MODAL CONTENT - Stop propagation
            ======================================== */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-strong rounded-2xl overflow-hidden max-w-4xl w-full mx-4 shadow-2xl border border-primary/20"
            >
              {/* ========================================
                  VIDEO/IMAGE SECTION với Gradient
              ======================================== */}
              <div className="relative aspect-video">
                {/* Video Embed (YouTube) */}
                {movie.videoUrl ? (
                  <iframe
                    src={`${movie.videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={movie.title}
                  />
                ) : (
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 pointer-events-none"></div>

                {/* Close Button với Neon Effect */}
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center border border-primary/50 hover:bg-primary/20 transition z-10"
                >
                  <X size={24} color="white" />
                </motion.button>

                {/* Mute/Unmute Button */}
                {movie.videoUrl && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-zinc-900/80 rounded-full flex items-center justify-center border border-white/50 hover:border-white transition"
                  >
                    {isMuted ? (
                      <VolumeX size={20} color="white" />
                    ) : (
                      <Volume2 size={20} color="white" />
                    )}
                  </motion.button>
                )}

                {/* Title & Buttons Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
                    {movie.title}
                  </h2>

                  <div className="flex gap-3">
                    {/* Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.8)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onWatchNow(movie)}
                      className="bg-gradient-primary text-white px-8 py-2 rounded-full font-semibold transition flex items-center gap-2 shadow-neon"
                    >
                      <Play size={20} fill="white" />
                      Phát ngay
                    </motion.button>

                    {/* Add to List Button */}
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggleMyList(movie)}
                      className="w-10 h-10 glass border-2 border-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition"
                    >
                      {isInMyList ? (
                        <Check size={20} color="#06B6D4" />
                      ) : (
                        <Plus size={20} color="#06B6D4" />
                      )}
                    </motion.button>

                    {/* Like Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 glass border-2 border-primary/50 rounded-full flex items-center justify-center hover:bg-primary/20 transition"
                    >
                      <ThumbsUp size={20} color="#06B6D4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* ========================================
                  TABS & DETAILED INFORMATION SECTION
              ======================================== */}
              <div className="p-8">
                {/* Tabs Navigation */}
                <div className="flex gap-6 mb-6 border-b border-gray-800">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'episodes', label: movie.seasons ? 'Episodes' : 'Scenes' },
                    { id: 'similar', label: 'Similar' },
                    { id: 'details', label: 'Details' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 px-2 font-semibold transition relative ${
                        activeTab === tab.id
                          ? 'text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                      <div className="grid grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="col-span-2">
                          {/* Match & Meta Info với Neon Style */}
                          <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
                            {currentUser ? (
                              <span className="text-primary font-bold text-lg neon-pulse">
                                {movie.rating}% Match
                              </span>
                            ) : (
                              <span className="text-yellow-400 font-bold text-lg flex items-center gap-1">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                {movie.rating / 10}/10
                              </span>
                            )}
                            <span className="glass px-3 py-1 rounded-full">{movie.year}</span>
                            <span className="glass border border-primary/50 px-3 py-1 rounded-full">
                              {movie.maturityRating}
                            </span>
                            <span>{movie.seasons ? `${movie.seasons} Seasons` : movie.duration}</span>
                            <span className="border border-white/50 px-2 py-0.5">HD</span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-300 leading-relaxed mb-6">
                            {movie.description}
                          </p>

                          {/* Cast with avatars */}
                          <div className="mb-6">
                            <h4 className="text-sm text-gray-400 mb-3">Cast</h4>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {(movie.cast || ['John Doe', 'Jane Smith', 'Bob Wilson']).slice(0, 5).map((actor, i) => (
                                <div key={i} className="flex-shrink-0 text-center">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-2 flex items-center justify-center text-2xl font-bold">
                                    {actor.charAt(0)}
                                  </div>
                                  <p className="text-xs text-gray-400 max-w-[70px] truncate">{actor}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="text-sm space-y-4">
                          {/* Director */}
                          <div>
                            <span className="text-gray-400 flex items-center gap-2 mb-1">
                              <Film className="w-4 h-4" /> Director:
                            </span>
                            <span className="text-white">Christopher Nolan</span>
                          </div>

                          {/* Genres */}
                          <div>
                            <span className="text-gray-400">Genres: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {movie.genre.map((g, i) => (
                                <span key={i} className="glass px-3 py-1 rounded-full text-xs border border-primary/30">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Duration */}
                          <div>
                            <span className="text-gray-400 flex items-center gap-2">
                              <Clock className="w-4 h-4" /> Duration:
                            </span>
                            <span className="text-white">{movie.duration}</span>
                          </div>

                          {/* Release */}
                          <div>
                            <span className="text-gray-400 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> Release:
                            </span>
                            <span className="text-white">{movie.year}</span>
                          </div>

                          {/* Rating */}
                          <div>
                            <span className="text-gray-400 flex items-center gap-2">
                              <Star className="w-4 h-4" /> Rating:
                            </span>
                            <span className="text-yellow-400 font-bold">{movie.rating / 10}/10</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EPISODES TAB */}
                    {activeTab === 'episodes' && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          {movie.seasons ? `Season 1 (${movie.seasons} total)` : 'Featured Scenes'}
                        </h3>
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((ep) => (
                            <div
                              key={ep}
                              className="glass rounded-lg p-4 hover:bg-white/10 transition cursor-pointer group"
                            >
                              <div className="flex gap-4">
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={movie.backdropUrl}
                                    alt={`Episode ${ep}`}
                                    className="w-32 h-18 object-cover rounded"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <Play size={24} fill="white" className="text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">Episode {ep}</h4>
                                    <span className="text-sm text-gray-400">{35 + ep}m</span>
                                  </div>
                                  <p className="text-sm text-gray-400 line-clamp-2">
                                    An exciting episode with unexpected twists and turns that will keep you on the edge of your seat.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SIMILAR TAB */}
                    {activeTab === 'similar' && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">More Like This</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                              key={item}
                              className="group cursor-pointer"
                            >
                              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                                <img
                                  src={movie.backdropUrl}
                                  alt={`Similar ${item}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition">
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-primary font-bold text-sm">{85 + item}%</span>
                                      <span className="text-xs">{movie.year}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold group-hover:text-primary transition">
                                Similar Movie {item}
                              </h4>
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                {movie.genre.slice(0, 2).join(', ')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">About {movie.title}</h3>
                          <p className="text-gray-300 leading-relaxed mb-6">
                            {movie.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <div>
                              <span className="text-gray-400">Cast: </span>
                              <span className="text-white">
                                {(movie.cast || ['John Doe', 'Jane Smith', 'Bob Wilson']).join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Director: </span>
                              <span className="text-white">Christopher Nolan</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Writers: </span>
                              <span className="text-white">Jonathan Nolan, Christopher Nolan</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="text-gray-400">Resolution: </span>
                              <span className="text-white">4K Ultra HD</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Audio: </span>
                              <span className="text-white">Dolby Atmos 5.1 Surround</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Subtitles: </span>
                              <span className="text-white">English, Spanish, French, Vietnamese</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Studio: </span>
                              <span className="text-white">Warner Bros. Pictures</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                          <h4 className="font-semibold mb-3">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {[...movie.genre, 'Popular', 'Trending', 'Award Winner'].map((tag, i) => (
                              <span
                                key={i}
                                className="glass px-4 py-2 rounded-full text-sm hover:bg-primary/20 transition cursor-pointer border border-primary/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
