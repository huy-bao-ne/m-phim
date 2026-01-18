import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  X,
  Settings,
  Subtitles,
  FastForward,
  MinusSquare,
} from 'lucide-react';

const VideoPlayer = ({ movie, onClose, onNextEpisode, onMinimize, currentUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedPosition, setSavedPosition] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showNextEpisodeCountdown, setShowNextEpisodeCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Load saved watch position
  useEffect(() => {
    if (currentUser && movie) {
      const key = `mephim_resume_${currentUser.id}_${movie.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.position > 10 && data.position < data.duration - 30) {
          setSavedPosition(data.position);
          setShowResumePrompt(true);
        } else {
          // Start from beginning if near start or end
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        }
      } else {
        // No saved position, auto-play
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  }, [movie, currentUser]);

  // Handle video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Auto-save watch position every 5 seconds
  useEffect(() => {
    if (currentUser && movie && isPlaying && currentTime > 0) {
      saveIntervalRef.current = setInterval(() => {
        const key = `mephim_resume_${currentUser.id}_${movie.id}`;
        localStorage.setItem(key, JSON.stringify({
          position: currentTime,
          duration: duration,
          timestamp: Date.now()
        }));
      }, 5000);
    }
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [currentUser, movie, isPlaying, currentTime, duration]);

  // Resume playback handlers
  const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = savedPosition;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowResumePrompt(false);
  };

  const handleStartFromBeginning = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowResumePrompt(false);
  };

  // Playback speed change
  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
      localStorage.setItem('mephim_playback_speed', speed.toString());
    }
  };

  // Load saved playback speed
  useEffect(() => {
    const savedSpeed = localStorage.getItem('mephim_playback_speed');
    if (savedSpeed && videoRef.current) {
      const speed = parseFloat(savedSpeed);
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  }, []);

  // Update current time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Show skip intro between 10s and 90s
      const time = videoRef.current.currentTime;
      setShowSkipIntro(time >= 10 && time <= 90);

      // Show next episode countdown in last 30 seconds
      if (movie.seasons && onNextEpisode && duration - time <= 30 && duration - time > 0) {
        if (!showNextEpisodeCountdown) {
          setShowNextEpisodeCountdown(true);
          setCountdown(Math.floor(duration - time));
        }
      }

      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / duration) * 100);
      }
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        videoRef.current.volume = 0;
        setVolume(0);
      } else {
        videoRef.current.volume = volume || 0.5;
        setVolume(volume || 0.5);
      }
    }
  };

  // Seek video
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Skip intro
  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 91; // Skip to after intro
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (movie.seasons && onNextEpisode) {
      // Auto play next episode after countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onNextEpisode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      countdownIntervalRef.current = timer;
    }
  };

  const handleSkipCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowNextEpisodeCountdown(false);
  };

  const handlePlayNextNow = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    onNextEpisode();
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      // Save position one last time on unmount
      if (currentUser && movie && currentTime > 0) {
        const key = `mephim_resume_${currentUser.id}_${movie.id}`;
        localStorage.setItem(key, JSON.stringify({
          position: currentTime,
          duration: duration,
          timestamp: Date.now()
        }));
      }
    };
  }, [isPlaying, currentUser, movie, currentTime, duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isFullscreen]);

  // Format time
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={resetControlsTimeout}
      onClick={togglePlayPause}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Resume Playback Prompt */}
      <AnimatePresence>
        {showResumePrompt && (
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="glass border-2 border-primary/30 rounded-2xl p-8 max-w-md text-center"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h3 className="text-2xl font-bold mb-4">Continue Watching?</h3>
              <p className="text-white/80 mb-6">
                You stopped at {formatTime(savedPosition)}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleStartFromBeginning}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                >
                  Start from Beginning
                </button>
                <button
                  onClick={handleResume}
                  className="flex-1 px-6 py-3 bg-gradient-primary hover:shadow-neon rounded-lg font-semibold transition-all"
                >
                  Resume
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar with title and close button */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold">{movie.title}</h2>
                {movie.seasons && (
                  <p className="text-white/80 text-sm">Season 1, Episode 1</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onMinimize && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMinimize();
                    }}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    title="Picture-in-Picture"
                  >
                    <MinusSquare className="w-6 h-6 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Intro button */}
      <AnimatePresence>
        {showSkipIntro && showControls && !showResumePrompt && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              skipIntro();
            }}
            className="absolute bottom-32 right-8 px-6 py-3 bg-white/90 hover:bg-white text-dark font-bold rounded-lg transition-colors z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>

      {/* Next Episode Countdown */}
      <AnimatePresence>
        {showNextEpisodeCountdown && showControls && !showResumePrompt && (
          <motion.div
            className="absolute bottom-32 right-8 glass border-2 border-primary/30 rounded-xl p-6 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <p className="text-white/80 text-sm mb-2">Next Episode</p>
              <h3 className="text-xl font-bold">Season 1, Episode 2</h3>
              <p className="text-white/60 text-sm mt-1">The Adventure Continues</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePlayNextNow}
                className="px-6 py-2 bg-gradient-primary hover:shadow-neon rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Play Now
              </button>
              <button
                onClick={handleSkipCountdown}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors text-sm"
              >
                Cancel ({countdown}s)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div className="mb-4">
              <div className="relative w-full h-1 bg-white/30 rounded-full overflow-hidden group cursor-pointer">
                {/* Buffered progress */}
                <div
                  className="absolute h-full bg-white/50 transition-all"
                  style={{ width: `${buffered}%` }}
                />
                {/* Current progress */}
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute h-full bg-primary transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Left controls */}
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white fill-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-white" />
                  )}
                </button>

                {/* Skip backward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(-10);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Lùi 10s"
                >
                  <SkipBack className="w-6 h-6 text-white" />
                </button>

                {/* Skip forward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(10);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Tua 10s"
                >
                  <SkipForward className="w-6 h-6 text-white" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover:w-20 transition-all duration-300 accent-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Time display */}
                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-4">
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSpeedMenu(!showSpeedMenu);
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors text-sm"
                  >
                    {playbackSpeed}x
                  </button>
                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 right-0 glass border border-primary/30 rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`w-full px-4 py-2 text-left hover:bg-primary/20 transition-colors ${
                              speed === playbackSpeed ? 'bg-primary/30 text-primary font-bold' : 'text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Next episode (if series) */}
                {movie.seasons && onNextEpisode && !showNextEpisodeCountdown && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNextEpisode();
                    }}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <FastForward className="w-5 h-5" />
                    Next Episode
                  </button>
                )}

                {/* Subtitles */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Phụ đề"
                >
                  <Subtitles className="w-6 h-6 text-white" />
                </button>

                {/* Settings */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Cài đặt"
                >
                  <Settings className="w-6 h-6 text-white" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-6 h-6 text-white" />
                  ) : (
                    <Maximize className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play/pause icon on click */}
      <AnimatePresence>
        {!isPlaying && showControls && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="p-6 bg-black/50 rounded-full">
              <Play className="w-16 h-16 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;
