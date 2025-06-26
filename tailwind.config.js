/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
      animation: {
        'slide-in': 'in 0.5s ease-out forwards',
      },
      keyframes: {
        in: {
          '0%': { opacity: 0, transform: 'translateY(50px) rotate(90deg)' },
          '100%': { opacity: 1, transform: 'translateY(0) rotate(0)' },
        },
      },
    },
  },
  plugins: [],
}
