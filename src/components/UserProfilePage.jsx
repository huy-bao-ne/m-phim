import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Clock, Settings, LogOut, Edit, Mail, Phone, MapPin, Crown, Zap } from 'lucide-react';
import PlanUpgradeModal from './PlanUpgradeModal';
import EditProfileModal from './EditProfileModal';
import { getPlanById } from '../utils/subscriptionPlans';

const UserProfilePage = ({ myList, watchHistory, onMovieClick, onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get actual user data
  const user = currentUser || JSON.parse(localStorage.getItem('mephim_current_user') || '{}');
  const userPlan = getPlanById(user.subscription || 'basic');

  const handleSaveProfile = (formData, avatarPreview) => {
    // Update user data
    const updatedUser = { 
      ...user, 
      ...formData,
      avatar: avatarPreview || user.avatar
    };
    
    // Save to localStorage
    localStorage.setItem('mephim_current_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('mephim_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
      localStorage.setItem('mephim_users', JSON.stringify(users));
    }
    
    // Reload to reflect changes
    window.location.reload();
  };

  const handleUpgradePlan = (planId, billing) => {
    // Update user subscription
    const updatedUser = { ...user, subscription: planId };
    localStorage.setItem('mephim_current_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('mephim_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex].subscription = planId;
      localStorage.setItem('mephim_users', JSON.stringify(users));
    }
    
    // Reload page to reflect changes
    window.location.reload();
  };

  const stats = [
    { label: 'Movies Watched', value: watchHistory?.length || 0, icon: Clock },
    { label: 'My List', value: myList?.length || 0, icon: Heart },
    { label: 'Hours Streamed', value: '142h', icon: User },
    { label: 'Favorite Genre', value: 'Action', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-dark pt-20 pb-12">
      {/* Header with Profile Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-end px-8 md:px-16 pb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-bold border-4 border-dark shadow-2xl overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="ml-6">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <span className="glass px-3 py-1 rounded-full text-sm border" style={{ borderColor: userPlan.color }}>
                <span style={{ color: userPlan.color }}>{userPlan.name}</span> Member
              </span>
              <span className="text-sm">• Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-8 md:px-16 -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-4 hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-8 md:px-16 mb-8">
        <div className="flex gap-6 border-b border-gray-800">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'watchHistory', label: 'Watch History' },
            { id: 'mylist', label: 'My List' },
            { id: 'settings', label: 'Settings' }
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
                  layoutId="profileTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 md:px-16">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{user.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="mt-6 w-full py-2 glass border border-primary/50 rounded-lg hover:bg-primary/20 transition"
                >
                  Edit Profile
                </button>
              </div>

              {/* Subscription Info */}
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Subscription</h3>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-4 py-2 bg-gradient-primary hover:shadow-neon rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    {userPlan.id === 'basic' ? (
                      <>
                        <Crown className="w-4 h-4" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Change Plan
                      </>
                    )}
                  </button>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold" style={{ color: userPlan.color }}>
                      {userPlan.name}
                    </span>
                    <span className="glass px-3 py-1 rounded-full text-xs border" style={{ borderColor: userPlan.color }}>
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {userPlan.price === 0 ? 'Free Forever' : 'Next billing date: Feb 18, 2026'}
                  </p>
                </div>
                <div className="space-y-2 text-sm mb-6">
                  {userPlan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {watchHistory?.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => onMovieClick(item.movie)}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer"
                  >
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.movie.title}</h4>
                      <p className="text-sm text-gray-400">{item.movie.year}</p>
                      <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WATCH HISTORY TAB */}
        {activeTab === 'watchHistory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Watch History</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {watchHistory?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onMovieClick(item.movie)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold line-clamp-1">{item.movie.title}</h4>
                  <p className="text-xs text-gray-400">{item.progress}% completed</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* MY LIST TAB */}
        {activeTab === 'mylist' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">My List ({myList?.length || 0})</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {myList?.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onMovieClick(movie)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="mt-2 text-sm font-semibold line-clamp-1">{movie.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Playback Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Video Quality</h4>
                    <p className="text-sm text-gray-400">Streaming quality preference</p>
                  </div>
                  <select className="glass px-4 py-2 rounded-lg">
                    <option>4K Ultra HD</option>
                    <option>1080p Full HD</option>
                    <option>720p HD</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Auto-play Next</h4>
                    <p className="text-sm text-gray-400">Automatically play next episode</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Subtitles</h4>
                    <p className="text-sm text-gray-400">Show subtitles by default</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">New Releases</h4>
                    <p className="text-sm text-gray-400">Get notified about new movies and shows</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Recommendations</h4>
                    <p className="text-sm text-gray-400">Personalized content suggestions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6" />
                </div>
              </div>
            </div>

            <button className="w-full py-3 glass border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed bottom-8 left-8 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg hover:shadow-primary/50 transition"
      >
        ←
      </button>

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={user.subscription || 'basic'}
        onSelectPlan={handleUpgradePlan}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfilePage;
