const path = require('path');

module.exports = {
    publicPath: '/',
    pwa: {
        name: "Atlantic",
        theme_color: "#007bff",
        appleMobileWebAppCapable: "yes",
        manifestOptions: {
            short_name: "Atlantic",
            start_url: "./index.html",
            display: "standalone",
            background_color: "#000000",
            orientation: "landscape",
            icons: [
                {
                    "src": "./img/icons/android-chrome-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "./img/icons/android-chrome-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
        },
        workboxOptions: {
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /\/api\//,
                    handler: "networkFirst",
                    options: {
                        cacheName: 'api-cache',
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    }
                },
                {
                    urlPattern: /\/media\//,
                    handler: "cacheFirst",
                    options: {
                        cacheName: 'media-cache',
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    }
                },
                {
                    urlPattern: /\/img\/icons|\.ico/,
                    handler: "cacheFirst",
                    options: {
                        cacheName: 'ico-cache',
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
    },

}