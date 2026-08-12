/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: {
          light: '#F5ECE1',
          DEFAULT: '#E6D5B8',
          dark: '#D0BA95',
        },
        ledgerInk: {
          light: '#2E3531',
          DEFAULT: '#1F2421',
          dark: '#111412',
        },
        vintageRed: {
          light: '#B24D4D',
          DEFAULT: '#993333',
          dark: '#802626',
        },
        ledgerGrid: {
          light: '#D3DDD2',
          DEFAULT: '#BAC8B9',
          dark: '#A1B39F',
        },
        paperWhite: {
          light: '#FFFFFF',
          DEFAULT: '#FAF6EE',
          dark: '#F0E8D9',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        ledger: ['"Courier Prime"', 'Courier New', 'Courier', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'vintage': '4px 4px 0px 0px rgba(31, 36, 33, 1)',
        'vintage-sm': '2px 2px 0px 0px rgba(31, 36, 33, 1)',
        'vintage-lg': '8px 8px 0px 0px rgba(31, 36, 33, 1)',
      }
    },
  },
  plugins: [],
}
