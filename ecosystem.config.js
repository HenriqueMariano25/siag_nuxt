module.exports = {
  apps: [
    {
      name: 'Siag',
      port: '82',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      args: 'start'
    }
  ]
}
