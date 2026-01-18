/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // mêphim Brand Colors
        primary: '#06B6D4',      // Cyan
        secondary: '#8B5CF6',    // Purple
        accent: '#EC4899',       // Pink
        dark: '#0F172A',         // Slate 900
        'dark-light': '#1E293B', // Slate 800
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
        'gradient-glow': 'linear-gradient(135deg, #06B6D4 0%, #EC4899 50%, #8B5CF6 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(6, 182, 212, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-x': {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': { 
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)'
          },
        },
      },
    },
  },
  plugins: [],
}
