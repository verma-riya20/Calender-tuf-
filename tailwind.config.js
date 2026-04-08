/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        accent: 'var(--accent)',
        'accent-muted': 'var(--accent-muted)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
        'flip-in': 'flipIn 0.5s ease forwards',
        'flip-out': 'flipOut 0.5s ease forwards',
        'pop': 'pop 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideLeft: {
          from: { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
          to: { opacity: '0', transform: 'translateX(-24px) rotateY(-5deg)' },
        },
        slideRight: {
          from: { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
          to: { opacity: '0', transform: 'translateX(24px) rotateY(5deg)' },
        },
        flipIn: {
          from: { opacity: '0', transform: 'translateX(24px) rotateY(5deg)' },
          to: { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
        },
        flipOut: {
          from: { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
          to: { opacity: '0', transform: 'translateX(-24px) rotateY(-5deg)' },
        },
        pop: {
          from: { transform: 'scale(0.85)' },
          to: { transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
