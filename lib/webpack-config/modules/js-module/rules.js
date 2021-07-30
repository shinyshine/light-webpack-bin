const babelOptions = require('./babelrc');

module.exports = {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader',
        options: {
            ...babelOptions,
            cacheDirectory: true
        },
    }]
}