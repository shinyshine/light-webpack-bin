const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        detail: './src/pages/detail/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env', {
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                }
                            ],
                            ['@babel/preset-react'],
                            "@babel/preset-typescript"
                        ],
                        cacheDirectory: true
                    },
                }]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json']
    },
}