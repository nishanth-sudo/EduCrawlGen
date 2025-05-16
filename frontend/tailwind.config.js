/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50, #eef2ff)',
          100: 'var(--color-primary-100, #e0e7ff)',
          200: 'var(--color-primary-200, #c7d2fe)',
          300: 'var(--color-primary-300, #a5b4fc)',
          400: 'var(--color-primary-400, #818cf8)',
          500: 'var(--color-primary-500, #6366f1)',
          600: 'var(--color-primary-600, #4f46e5)',
          700: 'var(--color-primary-700, #4338ca)',
          800: 'var(--color-primary-800, #3730a3)',
          900: 'var(--color-primary-900, #312e81)',
          950: 'var(--color-primary-950, #1e1b4b)',
        },
        secondary: {
          50: 'var(--color-secondary-50, #f0f9ff)',
          100: 'var(--color-secondary-100, #e0f2fe)',
          200: 'var(--color-secondary-200, #bae6fd)',
          300: 'var(--color-secondary-300, #7dd3fc)',
          400: 'var(--color-secondary-400, #38bdf8)',
          500: 'var(--color-secondary-500, #0ea5e9)',
          600: 'var(--color-secondary-600, #0284c7)',
          700: 'var(--color-secondary-700, #0369a1)',
          800: 'var(--color-secondary-800, #075985)',
          900: 'var(--color-secondary-900, #0c4a6e)',
          950: 'var(--color-secondary-950, #082f49)',
        },
      },
      fontSize: {
        'preference-small': 'var(--font-size-small, 0.875rem)',
        'preference-base': 'var(--font-size-base, 1rem)',
        'preference-large': 'var(--font-size-large, 1.125rem)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};