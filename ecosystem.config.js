module.exports = {
  apps: [
    {
      name: 'SiagNuxt',
      exec_mode: 'cluster',
      instances: '1',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
    }
  ],
  deploy: {
    production: {
      path: '/home/utent/Sistema/siag/siag_nuxt',
      'post-deploy': 'npm install && npm build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
