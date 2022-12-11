/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-color': '#00a2e8',
        'light-grey': '#222',
      },
      fontSize: {
        xxs: '0.6rem',
        xs: '0.7rem',
      },
      screens: {
        xs: { max: '638.98px' },
      },
    },
  },
  plugins: [],
};
