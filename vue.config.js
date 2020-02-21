const path = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

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
    transpileDependencies: [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],
    configureWebpack: {
        plugins: [
            // CKEditor needs its own plugin to be built using webpack.
            new CKEditorWebpackPlugin({
                // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
                language: 'en'
            })
        ]
    },

    // Vue CLI would normally use its own loader to load .svg and .css files, however:
    //	1. The icons used by CKEditor must be loaded using raw-loader,
    //	2. The CSS used by CKEditor must be transpiled using PostCSS to load properly.
    chainWebpack: config => {
        // (1.) To handle editor icons, get the default rule for *.svg files first:
        const svgRule = config.module.rule('svg');

        // Then you can either:
        //
        // * clear all loaders for existing 'svg' rule:
        //
        svgRule.uses.clear();
        //
        // * or exclude ckeditor directory from node_modules:
        //svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));

        // Add an entry for *.svg files belonging to CKEditor. You can either:
        //
        // * modify the existing 'svg' rule:
        //
        svgRule.use('raw-loader').loader('raw-loader');
        //
        // * or add a new one:
        /*config.module
            .rule('cke-svg')
            .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
            .use('raw-loader')
            .loader('raw-loader');*/

        // (2.) Transpile the .css files imported by the editor using PostCSS.
        // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
        config.module
            .rule('cke-css')
            .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
            .use('postcss-loader')
            .loader('postcss-loader')
            .tap(() => {
                return styles.getPostCssConfig({
                    themeImporter: {
                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                    },
                    minify: true
                });
            });
    }

}