import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Minimize2 } from 'lucide-react';

const PictureInPicture = ({ movie, onClose, onMaximize, currentUser }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 280 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // Load saved watch position
  useEffect(() => {
    if (currentUser && movie) {
      const key = `mephim_resume_${currentUser.id}_${movie.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        if (videoRef.current && data.position > 0) {
          videoRef.current.currentTime = data.position;
        }
      }
    }
  }, [movie, currentUser]);

  // Auto-save watch position
  useEffect(() => {
    if (currentUser && movie && isPlaying && currentTime > 0) {
      saveIntervalRef.current = setInterval(() => {
        const key = `mephim_resume_${currentUser.id}_${movie.id}`;
        localStorage.setItem(key, JSON.stringify({
          position: currentTime,
          timestamp: Date.now()
        }));
      }, 5000);
    }
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [currentUser, movie, isPlaying, currentTime]);

  // Auto-play
  useEffect(() => {
    if (videoRef.current && movie.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  }, [movie.videoUrl]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.pip-controls')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 400));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - (isMinimized ? 60 : 260)));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    // Save position before closing
    if (currentUser && movie && currentTime > 0) {
      const key = `mephim_resume_${currentUser.id}_${movie.id}`;
      localStorage.setItem(key, JSON.stringify({
        position: currentTime,
        timestamp: Date.now()
      }));
    }
    onClose();
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    onMaximize();
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`fixed z-40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        isMinimized ? 'w-64' : 'w-96'
      } glass border-2 border-primary/30 rounded-xl overflow-hidden shadow-neon`}
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onMouseDown={handleMouseDown}
      drag={false}
    >
      {/* Video */}
      {!isMinimized && (
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            className="w-full h-full object-contain"
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            loop
          />
          
          {/* Hover controls overlay */}
          <div className="pip-controls absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm font-bold truncate flex-1 pr-2">
                {movie.title}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={toggleMinimize}
                  className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleMaximize}
                  className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  title="Maximize"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 bg-black/50 hover:bg-red-600 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Center play/pause */}
            <div className="flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-white" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-white" />
                )}
              </button>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMute}
                className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized bar */}
      {isMinimized && (
        <div className="pip-controls flex items-center justify-between p-3 bg-dark/95">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={togglePlayPause}
              className="p-2 bg-primary/20 hover:bg-primary/30 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-primary fill-primary" />
              ) : (
                <Play className="w-4 h-4 text-primary fill-primary" />
              )}
            </button>
            <div className="flex-1">
              <h3 className="text-white text-sm font-bold truncate">{movie.title}</h3>
              <p className="text-white/60 text-xs">Now Playing</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={toggleMinimize}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 bg-white/10 hover:bg-red-600 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Dragging hint */}
      {!isDragging && !isMinimized && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none">
          Drag to move
        </div>
      )}
    </motion.div>
  );
};

export default PictureInPicture;
