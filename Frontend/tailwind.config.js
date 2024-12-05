/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        'bizopTextBlue':'#1EBBD7',
        'bizopBlue':'#4B91F1',
      }
    },
  },
  plugins: [],
}

