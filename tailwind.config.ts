import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-surface': '#0A0A0A',
        'dark-card': '#0F0F0F',
        'dark-elevated': '#1A1A1A',
        'accent-white': '#FFFFFF',
        'accent-offwhite': '#E5E5E5',
        'success': '#E5E5E5',
        'error': '#E5E5E5',
        'warning': '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        'container': '1400px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUpStagger 0.8s ease-out forwards',
        'glow': 'glowPulse 3s ease-in-out infinite',
        'typing': 'typing 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config