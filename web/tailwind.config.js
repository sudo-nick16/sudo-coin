/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-1": "#F5F7FB",
        "dark-1": "#191A23",
        "dark-2": "#101215"
      }
    },
  },
  plugins: [],
}

