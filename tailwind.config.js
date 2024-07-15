/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        takaBG: 'url("/src/assets/golden.svg")',
        takaGradient: 'linear-gradient(110deg, #faa31c 0%, #f57921 50%, #f15b24 100%)',
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      const newUtilities = {
        '.scrollbar-hide': {
          'scrollbar-width': 'none', /* For Firefox */
          '-ms-overflow-style': 'none',  /* For Internet Explorer and Edge */
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none', /* For Chrome, Safari, and Opera */
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin', /* For Firefox */
        },
        '.taka-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#23311ade transparent',
        },
        '.taka-scrollbar::-webkit-scrollbar': {
          'width': '8px',
        },
        '.taka-scrollbar::-webkit-scrollbar-track': {
          'background': 'transparent',
        },
        '.taka-scrollbar::-webkit-scrollbar-thumb': {
          'background-color': '#23311ade',
          'border-radius': '10px',
          'border': '3px solid transparent',
          'background-clip': 'padding-box',
        },
        '.taka-scrollbar::-webkit-scrollbar-button': {
          'display': 'none',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
};