/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Custom animations for cyberpunk effects
      animation: {
        // Star animations
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        
        // Glitch effects
        'glitch': 'glitch 3s infinite',
        'glitch-1': 'glitch-1 2s infinite',
        'glitch-2': 'glitch-2 2.5s infinite',
        
        // Pulse effects
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'pulse-marker': 'pulse-marker 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        
        // Movement
        'grid-move': 'grid-move 20s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      
      keyframes: {
        // Star twinkle
        twinkle: {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.3',
            transform: 'scale(0.7)',
          },
        },
        
        // Slow ping for clicked stars
        'ping-slow': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        
        // Glitch animations
        glitch: {
          '0%, 90%, 100%': {
            transform: 'translate(0)',
          },
          '92%': {
            transform: 'translate(-2px, 2px)',
          },
          '94%': {
            transform: 'translate(2px, -2px)',
          },
          '96%': {
            transform: 'translate(-2px, -2px)',
          },
        },
        
        'glitch-1': {
          '0%, 95%, 100%': {
            transform: 'translate(0)',
            opacity: '0.8',
          },
          '97%': {
            transform: 'translate(-5px, 0)',
            opacity: '0.8',
          },
        },
        
        'glitch-2': {
          '0%, 95%, 100%': {
            transform: 'translate(0)',
            opacity: '0.8',
          },
          '97%': {
            transform: 'translate(5px, 0)',
            opacity: '0.8',
          },
        },
        
        // Pulse variations
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
        
        'pulse-marker': {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.2)',
          },
        },
        
        'neon-pulse': {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
        },
        
        // Grid movement
        'grid-move': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(50px)',
          },
        },
        
        // UI animations
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        
        'fade-in': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
      },
      
      // Custom clip-path for cyberpunk corners
      clipPath: {
        'cyber': 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
        'cyber-small': 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        'cyber-large': 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)',
      },
      
      // Extended border widths for glowing effects
      borderWidth: {
        '3': '3px',
      },
      
      // Custom shadows
      boxShadow: {
        'neon-fuchsia': '0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.8), 0 0 40px rgba(255, 0, 110, 0.5)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5)',
        'glow-strong': '0 0 30px currentColor, 0 0 60px currentColor',
      },
      
      // Custom colors (in case you want to use them)
      colors: {
        'cyber-dark': '#0a0014',
        'cyber-purple': '#1a0033',
        'cyber-deep': '#0f001f',
      },
    },
  },
  plugins: [
    // Plugin for clip-path utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.clip-path-cyber': {
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
        },
        '.clip-path-cyber-small': {
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        },
        '.clip-path-cyber-large': {
          clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};