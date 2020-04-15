module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://api.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css',
        type: 'text/css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css',
        type: 'text/css'
      }
    ]
  },
  /** Env variables. See .env
   *
   */
  env: {
    mapboxToken: process.env.MAPBOX_TOKEN,
    API: process.env.API
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['assets/style.scss', '@fortawesome/fontawesome-svg-core/styles.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui', '@/plugins/fontawesome.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    ['@nuxtjs/style-resources'],
    [
      'nuxt-i18n',
      {
        locales: [
          {
            name: 'Português',
            code: 'pt-br',
            iso: 'pt-BR',
            file: 'pt-BR.js'
          },
          {
            name: 'English',
            code: 'en',
            iso: 'en-US',
            file: 'en-US.js'
          }
        ],
        langDir: 'lang/',
        defaultLocale: 'en',
        lazy: true
      }
    ]
  ],
  styleResources: {
    scss: ['assets/style.scss']
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // An issue with webpack, see https://github.com/mapbox/mapbox-gl-draw/issues/626 for more information
      config.node = { fs: 'empty' };

      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      });
    }
  }
};
