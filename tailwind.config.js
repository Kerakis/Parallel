/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-color': '#00a2e8',
        'light-gray': '#f7f7f7',
        'dark-gray': '#222',
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
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
