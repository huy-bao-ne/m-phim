import React, { useState, useEffect } from 'react';
import { Search, Bell, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ currentUser, onSearch, showSearch = false, onCategoriesClick, onMyListClick, onHomeClick, onProfileClick, onLoginClick, onLogoutClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions data
  const recentSearches = ['The Dark Knight', 'Inception'];
  const trendingSearches = ['Stranger Things', 'Breaking Bad', 'The Office'];
  const suggestions = searchQuery.length > 0 
    ? ['The Dark Knight', 'The Matrix', 'The Godfather', 'The Shawshank Redemption']
        .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
      setShowSuggestions(false);
      if (onSearch) onSearch('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-dark/95 glass' : 'bg-gradient-to-b from-dark/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center space-x-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              mêphim
            </h1>
            <p className="text-[10px] text-primary/60 tracking-widest">UNLIMITED STREAMING</p>
          </motion.div>

          <div className="hidden md:flex space-x-6 text-sm">
            <motion.button
              onClick={onHomeClick}
              whileHover={{ scale: 1.1 }}
              className="hover:text-gray-300 transition"
            >
              Trang chủ
            </motion.button>
            <motion.button
              onClick={onCategoriesClick}
              whileHover={{ scale: 1.1 }}
              className="hover:text-gray-300 transition"
            >
              Thể loại
            </motion.button>
            <motion.button
              onClick={onMyListClick}
              whileHover={{ scale: 1.1 }}
              className="hover:text-gray-300 transition"
            >
              Danh sách của tôi
            </motion.button>
          </div>
        </div>

        {/* ========== RIGHT SIDE ICONS ========== */}
        <div className="flex items-center space-x-4">
          {/* Search Bar với Animation & Suggestions */}
          {showSearch && (
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <>
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Tìm phim, diễn viên..."
                      className="glass text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-12 right-0 w-64 glass-strong rounded-lg overflow-hidden border border-primary/20 shadow-2xl z-50"
                      >
                        {searchQuery.length === 0 ? (
                          <>
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                              <div className="p-3 border-b border-gray-800">
                                <p className="text-xs text-gray-400 mb-2">Recent Searches</p>
                                {recentSearches.map((search, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(search)}
                                    className="block w-full text-left px-2 py-1 text-sm hover:text-primary transition"
                                  >
                                    {search}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Trending Searches */}
                            <div className="p-3">
                              <p className="text-xs text-gray-400 mb-2">Trending Now</p>
                              {trendingSearches.map((search, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSuggestionClick(search)}
                                  className="w-full text-left px-2 py-1 text-sm hover:text-primary transition flex items-center gap-2"
                                >
                                  <span className="text-primary">🔥</span>
                                  {search}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          /* Search Suggestions */
                          <div className="p-3">
                            {suggestions.length > 0 ? (
                              suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left px-2 py-1 text-sm hover:text-primary transition"
                                >
                                  <Search className="w-3 h-3 inline mr-2" />
                                  {suggestion}
                                </button>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400 px-2 py-1">No results found</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearchToggle}
                className="ml-2 text-white hover:text-gray-300 transition"
              >
                <Search size={20} />
              </motion.button>
            </div>
          )}

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white hover:text-gray-300 transition"
          >
            <Bell size={20} />
          </motion.button>

          {/* Login/Profile/Logout */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* User Avatar - Click để vào Profile */}
              <motion.button
                onClick={onProfileClick}
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-primary rounded-full cursor-pointer border-2 border-primary/50 flex items-center justify-center text-sm font-bold"
                title={currentUser.name}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </motion.button>

              {/* Logout Button */}
              <motion.button
                onClick={onLogoutClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white transition"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/20 transition"
            >
              <LogIn size={18} />
              <span className="text-sm font-medium">Đăng nhập</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
