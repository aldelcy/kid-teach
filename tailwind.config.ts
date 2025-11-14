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
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#991b1b',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        surface: {
          light: '#ffffff',
          dark: '#f5f5f5',
        },
        ok: '#22c55e',
        warn: '#f59e0b',
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1' }],
        'display-sm': ['3rem', { lineHeight: '1.1' }],
        'huge': ['2.5rem', { lineHeight: '1.2' }],
        'large': ['2rem', { lineHeight: '1.3' }],
      },
      spacing: {
        'tap': '48px', // Minimum tap target size
        'tap-lg': '64px',
      },
      borderRadius: {
        'card': '1.5rem',
        'tile': '2rem',
      },
      boxShadow: {
        'kid': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'kid-lg': '0 12px 32px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
export default config

