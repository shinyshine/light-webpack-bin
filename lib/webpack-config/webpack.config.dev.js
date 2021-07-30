const path = require('path');
const rootDir = process.cwd()

module.exports = {
    mode: 'development',
    output: {
        path: path.join(rootDir, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    minSize: 30000,
                    minChunks: 1,
                    chunks: 'initial',
                    priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
                },
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks: 3,
                    priority: 0,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json']
    },
    devServer: {
        port: 8080,
        liveReload: true,
        contentBase: path.join(rootDir, 'src')
    },
    devtool: 'eval-cheap-module-source-map',
}