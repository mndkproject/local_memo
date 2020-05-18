const { GenerateSW } = require('workbox-webpack-plugin')

module.exports = {
    publicPath: "./",
    pwa: {
        workboxPluginMode: 'GenerateSW'
    },
    configureWebpack: config => {
        config.plugins.push(
            new GenerateSW({
                cacheId: 'local-memo',
                skipWaiting: true,
                clientsClaim: true
            })
        )
    }
}