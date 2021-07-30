const path = require('path');
const fs = require('fs');
const HtmlWebpacklugin = require('html-webpack-plugin');
const HTMLPLUGINS = Symbol('Light#HtmlPlugins')

/**
 * 通过 入口文件entries，以及一些配置项
 * 返回一个html webpack plugin的插件数组
 */
class HtmlPlugins {
    /**
     * 
     * @param {*} options 
     * @param {Object} options.entries  // 入口entry对象，与webpackConfig.entry一致
     * @param {string} options.template // 默认html模板地址
     * @param {string} options.outputDir // html输出目录，默认就放在根目录下
     * @param {string} options.cwd // html输出目录，默认就放在根目录下
     */
    constructor(options) {
        this.options = options;
        this.baseDir = options.cwd || process.cwd();
        this.defaultTemplate = options.template || path.join(this.baseDir, 'index.html') // 尝试寻找根目录下的index.html;

        this.htmlOptions = {
            minify: true,
            favicon: options.favicon || 'default.favicon',
            template: this.defaultTemplate
        }

        this[HTMLPLUGINS] = [];       

        this.combinePlugins();
    }

    get plugins() {
        return this[HTMLPLUGINS];
    }

    combinePlugins() {
        const entries = this.options.entries;
        for(let entryName in entries) {
            const htmlOption = this.getHtmlOption(entryName);
            const htmlPlugin = new HtmlWebpacklugin(htmlOption);
            
            this.addPlugin(htmlPlugin);
        }
    }

    getHtmlOption(entryName) {
        const template = this.tryToFindTemplate(entryName)
        return {
            filename: `${entryName}.html`,
            template: template || this.template,
            chunks: [entryName]
        }
    }

    addPlugin(plugin) {
        this[HTMLPLUGINS].push(plugin);
    }

    tryToFindTemplate(entryName) {
        // 寻找src/pages/[entryName]/template.html
        const tmplPath = path.join(this.baseDir, 'src/pages', entryName, 'template.html');

        return fs.existsSync(tmplPath) ? tmplPath : '';

    }

    // resolveMinifyOptions() {
    //     const mode = this.options.mode;
    //     const isDev = mode === 'development';
    //     return {
    //         removeComments: isDev ? false : true, //移除HTML中的注释
    //         collapseWhitespace: true, //折叠有助于文档树中文本节点的空白区域
    //         removeStyleLinkTypeAttributes: true,
    //         minifyJS: true,
    //         minifyCSS: true,
    //         minifyURLs: true,
    //         ignoreCustomFragments: [/<!--[\s\S]*?-->/, /< {[\s\S]*?}/]
    //     }
    // }

}

module.exports = HtmlPlugins;
