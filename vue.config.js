module.exports = {
    publicPath: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true
        }
    },
    devServer: {
        proxy: {
            "/api": {
                target: 'http://localhost:8000'
            },
            "/admin": {
                target: 'http://localhost:8000'
            },
            "/media": {
                target: 'http://localhost:8000'
            }

        }
    }
}