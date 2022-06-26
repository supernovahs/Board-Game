/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('/footstepslanding.jpg')"
      }
    },
  },
  plugins: [],
}
