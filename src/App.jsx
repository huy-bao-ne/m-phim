import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieModal from './components/MovieModal';
import SearchResults from './components/SearchResults';
import MyListPage from './components/MyListPage';
import CategoriesPage from './components/CategoriesPage';
import UserProfilePage from './components/UserProfilePage';
import Top10Section from './components/Top10Section';
import ContinueWatchingSection from './components/ContinueWatchingSection';
import Toast from './components/Toast';
import LoginPage from './components/LoginPage';
import VideoPlayer from './components/VideoPlayer';
import PictureInPicture from './components/PictureInPicture';
import BackgroundParticles from './components/BackgroundParticles';
import TrendingBanner from './components/TrendingBanner';
import SpotlightSection from './components/SpotlightSection';
import ScrollReveal from './components/ScrollReveal';
import { HeroSkeleton, MovieRowSkeleton } from './components/LoadingSkeleton';
import { categories, getMoviesByCategory, searchMovies, movieData } from './data/movieData';
import { getMyListFromStorage, toggleMyList as toggleMyListStorage } from './utils/localStorage';
import { getBecauseYouWatchedRows, getTopRatedForUser, getNewReleasesForUser } from './utils/recommendations';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myList, setMyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showMyListPage, setShowMyListPage] = useState(false);
  const [showCategoriesPage, setShowCategoriesPage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPiP, setShowPiP] = useState(false);
  const [pipMovie, setPipMovie] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mephim_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const savedList = JSON.parse(localStorage.getItem(`mephim_mylist_${currentUser.id}`) || '[]');
      setMyList(savedList);
      
      const savedHistory = JSON.parse(localStorage.getItem(`mephim_history_${currentUser.id}`) || '[]');
      setWatchHistory(savedHistory);
    } else {
      setMyList([]);
      setWatchHistory([]);
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowLoginPage(false);
    showToast(`Chào mừng ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('mephim_current_user');
    setCurrentUser(null);
    setMyList([]);
    setWatchHistory([]);
    setShowProfilePage(false);
    setShowMyListPage(false);
    showToast('Đã đăng xuất thành công', 'info');
  };

  // ========================================
  // LOGIC: Xử lý mở Modal khi click vào phim
  // ========================================
  const handleMovieClick = (movie) => {
    console.log('Movie clicked:', movie);
    if (!movie) {
      console.error('No movie data received');
      return;
    }
    setSelectedMovie(movie);
    setIsModalOpen(true);
    
    // Add to watch history with random progress (only if logged in)
    if (currentUser) {
      const existingIndex = watchHistory.findIndex(item => item.movie.id === movie.id);
      let newHistory;
      
      if (existingIndex >= 0) {
        // Move to front if already exists
        newHistory = [
          watchHistory[existingIndex],
          ...watchHistory.filter((_, i) => i !== existingIndex)
        ];
      } else {
        // Add new with random progress
        newHistory = [
          { movie, progress: Math.floor(Math.random() * 70) + 10 }, // 10-80%
          ...watchHistory
        ].slice(0, 10); // Keep only 10 most recent
      }
      
      setWatchHistory(newHistory);
      localStorage.setItem(`mephim_history_${currentUser.id}`, JSON.stringify(newHistory));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  };

  const handleToggleMyList = (movie) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để thêm phim vào danh sách', 'info');
      setShowLoginPage(true);
      return;
    }

    const isInList = myList.some(m => m.id === movie.id);
    let newList;
    
    if (isInList) {
      newList = myList.filter(m => m.id !== movie.id);
    } else {
      newList = [...myList, movie];
    }
    
    setMyList(newList);
    localStorage.setItem(`mephim_mylist_${currentUser.id}`, JSON.stringify(newList));
    
    // Show toast notification
    const isAdded = !isInList;
    showToast(
      isAdded ? `Đã thêm "${movie.title}" vào danh sách` : `Đã xóa "${movie.title}" khỏi danh sách`,
      isAdded ? 'success' : 'info'
    );
  };

  const handleRemoveFromHistory = (movieId) => {
    if (!currentUser) return;
    
    const newHistory = watchHistory.filter(item => item.movie.id !== movieId);
    setWatchHistory(newHistory);
    localStorage.setItem(`mephim_history_${currentUser.id}`, JSON.stringify(newHistory));
    showToast('Đã xóa khỏi Xem tiếp', 'info');
  };

  const handleWatchNow = (movie) => {
    setPlayingMovie(movie);
    setIsPlaying(true);
    setIsModalOpen(false);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setTimeout(() => setPlayingMovie(null), 300);
  };

  const handleMinimizePlayer = () => {
    if (playingMovie) {
      setPipMovie(playingMovie);
      setShowPiP(true);
      setIsPlaying(false);
    }
  };

  const handleClosePiP = () => {
    setShowPiP(false);
    setTimeout(() => setPipMovie(null), 300);
  };

  const handleMaximizePiP = () => {
    if (pipMovie) {
      setPlayingMovie(pipMovie);
      setIsPlaying(true);
      setShowPiP(false);
      setPipMovie(null);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchMovies(query);
      setSearchResults(results);
      setShowMyListPage(false);
    } else {
      setSearchResults([]);
    }
  };

  const isMovieInMyList = (movieId) => {
    return myList.some(m => m.id === movieId);
  };

  const renderContent = () => {
    // Hiển thị Profile Page
    if (showProfilePage) {
      return (
        <UserProfilePage
          myList={myList}
          watchHistory={watchHistory}
          onMovieClick={handleMovieClick}
          onBack={() => setShowProfilePage(false)}
          currentUser={currentUser}
        />
      );
    }

    // Hiển thị Search Results
    if (searchQuery) {
      return (
        <SearchResults
          searchQuery={searchQuery}
          searchResults={searchResults}
          onMovieClick={handleMovieClick}
          myList={myList}
          onToggleMyList={handleToggleMyList}
        />
      );
    }

    // Hiển thị Categories Page
    if (showCategoriesPage) {
      return (
        <CategoriesPage
          movies={movieData}
          onMovieClick={handleMovieClick}
          myList={myList}
          onToggleMyList={handleToggleMyList}
          onBack={() => setShowCategoriesPage(false)}
        />
      );
    }

    // Hiển thị My List Page
    if (showMyListPage) {
      return (
        <MyListPage
          myList={myList}
          onMovieClick={handleMovieClick}
          onToggleMyList={handleToggleMyList}
        />
      );
    }

    // Hiển thị Home Page mặc định
    return (
      <>
        <Hero onMovieClick={handleMovieClick} currentUser={currentUser} />
        
        {/* Trending Banner */}
        <ScrollReveal delay={0.1}>
          <TrendingBanner 
            movies={movieData.filter(m => m.rating >= 90).slice(0, 5)}
            onMovieClick={handleMovieClick}
          />
        </ScrollReveal>

        {/* Spotlight Section */}
        <ScrollReveal delay={0.2}>
          <SpotlightSection
            movies={movieData.filter(m => m.rating >= 85).slice(0, 5)}
            onMovieClick={handleMovieClick}
            myList={myList}
            onToggleMyList={handleToggleMyList}
          />
        </ScrollReveal>
        
        {/* Continue Watching Section */}
        {watchHistory.length > 0 && (
          <ScrollReveal delay={0.1}>
            <ContinueWatchingSection
              watchHistory={watchHistory}
              onMovieClick={handleMovieClick}
              onRemoveFromHistory={handleRemoveFromHistory}
            />
          </ScrollReveal>
        )}

        {/* Top 10 Section */}
        <ScrollReveal delay={0.2}>
          <Top10Section
            movies={movieData}
            onMovieClick={handleMovieClick}
          />
        </ScrollReveal>

        {/* Because You Watched Rows (Personalized) */}
        {currentUser && watchHistory.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="px-4 md:px-8 lg:px-16">
              {getBecauseYouWatchedRows(watchHistory, movieData).map((row, index) => (
                <MovieRow
                  key={`because-${index}`}
                  title={row.title}
                  movies={row.movies}
                  onMovieClick={handleMovieClick}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Top Rated For You */}
        {currentUser && (watchHistory.length > 0 || myList.length > 0) && (
          <ScrollReveal delay={0.3}>
            <div className="px-4 md:px-8 lg:px-16">
              <MovieRow
                title="Top Rated For You"
                movies={getTopRatedForUser(watchHistory, myList, movieData, 10)}
                onMovieClick={handleMovieClick}
                myList={myList}
                onToggleMyList={handleToggleMyList}
              />
            </div>
          </ScrollReveal>
        )}

        {/* New Releases For You */}
        {currentUser && watchHistory.length > 0 && (
          <ScrollReveal delay={0.4}>
            <div className="px-4 md:px-8 lg:px-16">
              <MovieRow
                title="New Releases For You"
                movies={getNewReleasesForUser(watchHistory, movieData, 10)}
                onMovieClick={handleMovieClick}
                myList={myList}
                onToggleMyList={handleToggleMyList}
              />
            </div>
          </ScrollReveal>
        )}
        
        <div className="relative z-10 -mt-32">
          {categories.map((category, index) => {
            const movies = getMoviesByCategory(category.id);
            if (movies.length === 0) return null;
            
            return (
              <ScrollReveal key={category.id} delay={0.1 * (index % 3)}>
                <MovieRow
                  title={category.name}
                  movies={movies}
                  onMovieClick={handleMovieClick}
                  myList={myList}
                  onToggleMyList={handleToggleMyList}
                />
              </ScrollReveal>
            );
          })}

          {/* My List Row nếu có phim */}
          {myList.length > 0 && (
            <ScrollReveal delay={0.2}>
              <MovieRow
                title="Danh sách của tôi"
                movies={myList}
                onMovieClick={handleMovieClick}
                myList={myList}
                onToggleMyList={handleToggleMyList}
              />
            </ScrollReveal>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden relative">
      {/* Background Particles Effect */}
      <BackgroundParticles />
      
      {/* Navbar - Luôn hiển thị */}
      <Navbar 
        currentUser={currentUser}
        onSearch={handleSearch}
        showSearch={true}
        onCategoriesClick={() => {
          setShowCategoriesPage(true);
          setShowMyListPage(false);
          setShowProfilePage(false);
          setSearchQuery('');
        }}
        onMyListClick={() => {
          if (!currentUser) {
            showToast('Vui lòng đăng nhập để xem danh sách của bạn', 'info');
            setShowLoginPage(true);
            return;
          }
          setShowMyListPage(true);
          setShowCategoriesPage(false);
          setShowProfilePage(false);
          setSearchQuery('');
        }}
        onHomeClick={() => {
          setShowMyListPage(false);
          setShowCategoriesPage(false);
          setShowProfilePage(false);
          setSearchQuery('');
        }}
        onProfileClick={() => {
          if (!currentUser) {
            showToast('Vui lòng đăng nhập để xem trang cá nhân', 'info');
            setShowLoginPage(true);
            return;
          }
          setShowProfilePage(true);
          setShowMyListPage(false);
          setShowCategoriesPage(false);
          setSearchQuery('');
        }}
        onLoginClick={() => setShowLoginPage(true)}
        onLogoutClick={handleLogout}
      />

      {/* Loading Screen */}
      {isLoading ? (
        <>
          <HeroSkeleton />
          <div className="px-4 md:px-8 lg:px-16 space-y-8 -mt-32">
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Main Content */}
          {renderContent()}
        </>
      )}

      {/* Footer với mêphim Brand */}
      <footer className="text-center text-gray-400 py-12 border-t border-primary/10 mt-20">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            mêphim
          </h2>
          <p className="text-sm">Production Ready Streaming Platform</p>
          <p className="text-xs text-gray-600">
            Built with ReactJS • Tailwind CSS • Framer Motion • Lucide React
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="glass px-3 py-1 rounded-full text-xs border border-primary/30">Glass Morphism</span>
            <span className="glass px-3 py-1 rounded-full text-xs border border-secondary/30">Neon Effects</span>
            <span className="glass px-3 py-1 rounded-full text-xs border border-accent/30">Unique Design</span>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            © 2024 mêphim. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Movie Detail Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInMyList={selectedMovie ? isMovieInMyList(selectedMovie.id) : false}
        onToggleMyList={handleToggleMyList}
        currentUser={currentUser}
        onWatchNow={handleWatchNow}
      />

      {/* Video Player */}
      {isPlaying && playingMovie && (
        <VideoPlayer
          movie={playingMovie}
          onClose={handleClosePlayer}
          onMinimize={handleMinimizePlayer}
          currentUser={currentUser}
        />
      )}

      {/* Picture-in-Picture Player */}
      {showPiP && pipMovie && (
        <PictureInPicture
          movie={pipMovie}
          onClose={handleClosePiP}
          onMaximize={handleMaximizePiP}
          currentUser={currentUser}
        />
      )}

      {/* Login Page */}
      {showLoginPage && (
        <LoginPage
          onLogin={handleLogin}
          onClose={() => setShowLoginPage(false)}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

export default App;
