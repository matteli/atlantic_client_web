module.exports = {
    publicPath: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: new RegExp("/api/"),
                    handler: "staleWhileRevalidate",
                    options: {
                        cacheName: 'api-cache',
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    }
                },
            ]
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