const chalk = require('chalk');
const path = require('path');
const Module = require("module");
const Server = require('./Server');
const Webpack = require('webpack');
const WebpackConfig = require('./webpack-config/WebpackConfig');
const CONFIG = Symbol('Light#config');
const COMPILER = Symbol('Light$compiler');
const fs = require('fs')

/**
 * opts.config  配置文件路径
 * opts.port 端口号
 */
class LightBin{
    constructor(opts = {}) {
        this.opts = opts;
        this.baseDir = process.cwd();
        this.configPath = path.join(__dirname, 'webpack.config.js');
        this.customPath = path.join(process.cwd(), opts.config || 'webpack.config.js');

        this[CONFIG] = {}

        this[COMPILER] = {};

        this._originalModuleCompile = Module.prototype._compile

    }

    dev() {
        // mode = development
        // const devOptions = this[CONFIG].devServer;
        // const server = new WebpackDevServer(this[COMPILER], devOptions)

        // const server = new Server(this.opts ,this[CONFIG]);

        // server.start();

        const webpackConfig = new WebpackConfig({
            mode: 'development'
        }).config


        this[CONFIG] = webpackConfig;
        this[COMPILER] = this.webpack(webpackConfig)

        const server = new Server(this[COMPILER], {
            ...webpackConfig.devServer
        });

        server.start()
        
    }


    build() {
        // mode = production

        const webpackConfig = new WebpackConfig({
            mode: 'production'
        }).config;

        this[CONFIG] = webpackConfig;

        // this.run(process.argv) // 备注：不应该改变customconfig，要浅拷贝出来

        const compiler = Webpack(webpackConfig, function() {
            console.log(chalk.red('收工'))
        });

        

    }

}

module.exports = LightBin;