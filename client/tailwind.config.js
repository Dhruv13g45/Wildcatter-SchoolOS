/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          white: '#ffffff',
          light: '#bebebe',
          mid: '#767676',
          dark: '#383838',
          black: '#000000',
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#bebebe',
          400: '#999999',
          500: '#767676',
          600: '#555555',
          700: '#383838',
          800: '#222222',
          900: '#111111',
          950: '#000000',
        }
      },
    },
  },
  plugins: [],
}
