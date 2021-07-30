const chalk = require('chalk');
const path = require('path');
const Module = require("module");
const WebpackCli = require('webpack-cli');
const Server = require('./Server');
const WebpackConfig = require('./webpack-config/WebpackConfig');
const CONFIG = Symbol('Light#config');
const COMPILER = Symbol('Light$compiler');
const fs = require('fs')

/**
 * opts.config  配置文件路径
 * opts.port 端口号
 */
class LightBin extends WebpackCli{
    constructor(opts = {}) {
        super();
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

        this.run(process.argv) // 备注：不应该改变customconfig，要浅拷贝出来
        
        // const cli = new WebpackCli()

        // cli.run([...process.argv, '--config', path.join(this.runtimeDir, 'webpack.config.js')])

        // console.log(webpackConfig)
    }

    async resolveConfig(options) {
        const config = { options: {}, path: new WeakMap() };

        config.options = this[CONFIG];
        // config.path.set(this[CONFIG], '/Users/luoxiaotong/Documents/light-webpack-bin/webpack.config.js');
        


        return config;
    }

    // async applyCLIPlugin(config) {
    //     return config
    // }

}

module.exports = LightBin;