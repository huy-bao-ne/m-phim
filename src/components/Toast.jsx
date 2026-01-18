import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'from-green-500/90 to-emerald-600/90',
    error: 'from-red-500/90 to-rose-600/90',
    info: 'from-blue-500/90 to-cyan-600/90',
    warning: 'from-yellow-500/90 to-orange-600/90'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-8 z-[9999] max-w-md"
        >
          <div className={`bg-gradient-to-r ${colors[type]} backdrop-blur-lg rounded-lg shadow-2xl p-4 flex items-center gap-3 border border-white/10`}>
            <div className="flex-shrink-0 text-white">
              {icons[type]}
            </div>
            <p className="text-white font-medium flex-1">
              {message}
            </p>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
