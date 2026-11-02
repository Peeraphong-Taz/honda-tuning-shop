/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honda: {
          red: '#DC2626',
          darkRed: '#991B1B',
          black: '#0F1115',
          dark: '#161922',
          card: '#1F2430',
          border: '#2E3547',
          gray: '#94A3B8'
        }
      }
    },
  },
  plugins: [],
};
