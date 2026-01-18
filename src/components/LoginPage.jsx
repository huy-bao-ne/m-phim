import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isLogin && !formData.name) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem('mephim_users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        const userSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          subscription: user.subscription || 'basic',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('mephim_current_user', JSON.stringify(userSession));
        onLogin(userSession);
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } else {
      // Register logic
      const users = JSON.parse(localStorage.getItem('mephim_users') || '[]');
      
      if (users.find(u => u.email === formData.email)) {
        setError('Email này đã được đăng ký');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        subscription: 'basic',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('mephim_users', JSON.stringify(users));

      // Auto login after register
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscription: 'basic',
        email: newUser.email,
        name: newUser.name,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('mephim_current_user', JSON.stringify(userSession));
      onLogin(userSession);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Demo account for testing
  const useDemoAccount = () => {
    setFormData({
      email: 'demo@mephim.com',
      password: 'demo123',
      name: 'Demo User'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl max-w-md w-full p-8 border border-primary/20"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            mêphim
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              isLogin
                ? 'bg-gradient-primary text-white shadow-lg shadow-primary/50'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !isLogin
                ? 'bg-gradient-primary text-white shadow-lg shadow-primary/50'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (only for register) */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tên của bạn"
                    className="w-full pl-11 pr-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full pl-11 pr-12 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold shadow-lg shadow-primary/50 hover:shadow-primary/70 transition"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </motion.button>
        </form>

        {/* Demo account */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Hoặc thử tài khoản demo</p>
          <button
            onClick={useDemoAccount}
            className="text-primary hover:text-secondary transition text-sm font-medium"
          >
            Sử dụng tài khoản demo
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 w-full glass text-gray-400 hover:text-white py-3 rounded-lg font-semibold transition"
        >
          Đóng
        </button>

        {/* Terms */}
        <p className="text-gray-500 text-xs text-center mt-4">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-secondary transition"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
