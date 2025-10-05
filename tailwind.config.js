/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"], // scan all HTML files in this folder
  theme: {
    extend: {},
  },
  plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
]

}
