/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas': '#f5f5f5',
        'canvas-grid': '#e5e5e5',
      },
    },
  },
  plugins: [],
}

