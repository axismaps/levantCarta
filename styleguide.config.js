const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    components: './components/**/[A-Z]*.vue',
    webpackConfig: {
        node: {
            fs: "empty"
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: require('./styleguide/babel.config')
                    }
                },
                {
                    test: /\.(css?|scss)(\?.*)?$/,
                    loader: 'style-loader!css-loader!sass-loader'
                }
            ]
        },
        plugins: [new VueLoaderPlugin()]
    },
    usageMode: 'expand',
    styleguideDir: 'dist'
}
