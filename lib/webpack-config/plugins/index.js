const HtmlPlugins = require('./HtmlPlugins');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const otherPlugins = require('./plugins');

const PLUGINS = Symbol('Light#Plugins');
const HTMLPLUGINS = Symbol('Light#HtmlPlugins');
const CSSPLUGINS = Symbol('Light#CssPlugins');

const path = require('path');


/**
 * 生成一系列常用plugins, 
 * 参数 mode, cwd,  htmlOptions { outputDir, template, favicon }, plugins,
 * 
 */
class WebpackPlugin {
    /**
     * 
     * @param {*} options 
     * @param {*} options.mode
     * @param {*} options.entries
     * @param {*} options.htmlOptions
     * @param {*} options.plugins
     */
    constructor(options) {
        this.options = options;
        this.cwd = options.cwd || process.cwd();
        
        this[PLUGINS] = [];
        this[HTMLPLUGINS] = [];
        this[CSSPLUGINS] = [];

        this.createHtmlPlugins();
        this.createCssPlugins();


        this.mergeAllPlugins();

    }

    get plugins() {
        return this[PLUGINS];
    }

    createHtmlPlugins() {
        if(this[HTMLPLUGINS].length) {
            return this[HTMLPLUGINS];
        } 
        const cwd = this.cwd;

        const htmlPlugins = new HtmlPlugins({
            mode: this.options.mode,
            entries: this.options.entries,

            cwd: cwd,
            template: path.join(cwd, 'template.html'),
            outputDir: 'html', // 所有html存放于${ouput}/html
            ...this.options.htmlOptions
        }).plugins;

        this[HTMLPLUGINS] = [...htmlPlugins];

        return htmlPlugins;
    }

    createCssPlugins() {
        if(this[CSSPLUGINS].length) {
            return this[CSSPLUGINS];
        }

        const isDev = this.options.mode === 'development';
        const cssPlugin = new MiniCssExtractPlugin({
            filename: isDev ? 'css/[name].css' : 'css/[name].[chunkhash:8].css'
        })

        this[CSSPLUGINS] = [cssPlugin];

        return cssPlugin;
    }

    mergeAllPlugins() {
        const mergePlugins = this.options.plugins || [];
        this[PLUGINS] = [
            ...this[HTMLPLUGINS],
            ...this[CSSPLUGINS],
            ...otherPlugins,
            ...mergePlugins
        ]
    }

}


module.exports = WebpackPlugin;