/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'satoshi-regular' : ['Satoshi-Regular'],
        'satoshi-bold' : ['Satoshi-Bold'],
        'satoshi-medium' : ['Satoshi-Medium'],
        'satoshi-black' : ['Satoshi-Black']
      }
  }
},
  plugins: []
};