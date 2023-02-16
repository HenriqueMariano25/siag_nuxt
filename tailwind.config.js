/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primaria: {
          '900': '#061733',
          '700': '#00275e',
          '500': '#0648a4',
        }
      },
      backgroundImage: {
        'login': "url('@/assets/img/img_fundo.jpg')",
      }
    },
  },
  plugins: [],
}
