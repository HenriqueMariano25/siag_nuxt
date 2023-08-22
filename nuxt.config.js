export default {
  head: {
    title: 'SIAG - Sistema Integrado Andrade Gutierrez',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  css: [
    '@/assets/css/main.css',
  ],

  server: {
    port: process.env.PORT
  },

  router: {
    // middleware: ['auth', 'admin']
  },

  plugins: [
    '@/plugins/lodash',
    '@/plugins/dayjs',
    '@/plugins/maska',
    '@/plugins/money',
    {src: '~/plugins/vue-apexcharts', ssr: false},
    '@/plugins/vueBlobJsonCsv',
  ],

  components: true,

  buildModules: [
    '@nuxt/postcss8',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/tailwindcss',
  ],

  axios: {
    baseURL: '/',
  },

  build: {
    transpile: [
      'maska',
      'money',
    ],
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  auth: {
    strategies: {
      localAdmin: {
        scheme: 'local',
        token: {
          property: 'token',
          global: true,
        },
        user: {
          property: false,
        },
        endpoints: {
          login: {url: '/usuario/login_admin', method: 'post'},
          user: {url: '/usuario/login_admin/buscar', method: 'get', propertyName: false},
          logout: {url: '/usuario/logout', method: 'post'},
        },
        tokenType: ''
      },
      local: {
        token: {
          property: 'token',
          global: true,
          maxAge: 3600
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/usuario/login/novo_padrao', method: 'post'},
          user: { url: '/usuario/login/buscar', method: 'get', propertyName: false},
          logout: {url: '/usuario/logout', method: 'post'},
        },
        tokenType: ''
      }
    }
  }
}




