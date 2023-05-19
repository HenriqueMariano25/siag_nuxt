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
          '300': '#0c61d5',
          '200': '#1872ed',
          '100': '#3c8bf8',
        }
      },
      backgroundImage: {
        'login': "url('@/assets/img/img_fundo.jpg')",
      }
    },
  },
  plugins: [],
}
