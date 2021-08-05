const WebpackBar = require('webpackbar');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = [
    new WebpackBar(),
    // new PreloadWebpackPlugin({
    //     rel: 'preload',
    //     include: 'asyncChunks'
    // }),
    // new BundleAnalyzerPlugin(),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorPluginOptions: {
            mergeLonghand: false,
            canPrint: true,
            discardComments: {
                removeAll: true // 移除注释
            }
        }
    }),
    new ForkTsCheckerWebpackPlugin()

]