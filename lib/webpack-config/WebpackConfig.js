const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const CONFIG = Symbol.for('Light#Config')
const ENTRIES = Symbol.for('Light#Entries')
const MODULE = Symbol.for('Light#Module')
const PLUGINS = Symbol.for('Light#Plugins')
const isFunction = require('lodash/isFunction')

const ResolveModuleRules = require('./modules');
const ResolvePlugins = require('./plugins');

class WebpackConfig {
    /**
     * 
     * @param {*} options 
     * @param {string} options.mode
     * @param {string} options.cwd
     */
    constructor(options) {
        this.options = options;
        this.cwd = options.cwd || process.cwd();
        this.mode = options.mode || 'production';

        this.defaultConfig = {};
        this.customConfig = {};

        this.loadDefaultConfig();
        this.loadCustomConfig();


        this[ENTRIES]= {};
        this[MODULE] = {};
        this[PLUGINS] = []

        this.resolveEntry();
        this.resolveModule();
        this.resolvePlugins();

        // this.writeConfigToDisk();

    }

    get config() {
        if(this[CONFIG]) {
            return this[CONFIG];
        }

        this[CONFIG] = {
            ...this.defaultConfig,
            ...this.customConfig,
            entry: this[ENTRIES],
            module: this[MODULE],
            plugins: this[PLUGINS],
            mode: this.mode,
        }
        return this[CONFIG];
    }


    loadDefaultConfig() {
        const mode = this.mode;
        const modeShort = mode === 'production' ? 'prod' : 'dev';
        this.defaultConfig = require(`./webpack.config.${modeShort}.js`);
    }

    loadCustomConfig() {
        const configPath = path.join(this.cwd, 'webpack.config.light.js');
        const isExisted = fs.existsSync(configPath);
        
        if(isExisted) {
            let config = require(configPath);

            if(isFunction(config)) {
                config = config();
            }

            this.customConfig = config;
        }

    }

    resolveEntry() {
        const customEntry = this.defaultConfig.entry || {};

        const baseDir = process.cwd();
        const entries = {};
        const pagesPath = path.join(baseDir, 'src/pages');
        const pages = fs.readdirSync(pagesPath);

        if(!pages || !pages.length) {
            console.log(chalk.red('没有入口文件：src/pages/**/index.[js|jsx|tsx]'))
            process.exit(1);
        }

        pages.forEach(pageDir => {
            const pageDirPath = path.join(pagesPath, pageDir)
            if(fs.statSync(pageDirPath).isDirectory()) {
                const pageContent = fs.readdirSync(pageDirPath);
                if(!pageContent || !pageContent.length) {
                    console.log(chalk.blue(`${pageDirPath} 不存在入口文件，将被忽略`))
                    return;
                }

                pageContent.forEach(file => {
                    const filename = path.basename(file);
                    if(/^index.(js|jsx|tsx)$/.test(filename)) {
                        entries[pageDir] = path.join(path.join(pageDirPath, file))
                    }
                })
            }
        })

        this[ENTRIES] = {
            ...entries,
            ...customEntry
        }


    }

    resolveModule() {
        const customModule = this.customConfig.module;
        const moduleRules = new ResolveModuleRules(customModule, this.options);
        this[MODULE] = moduleRules.module;
    }


    resolvePlugins() {
        const resolved = new ResolvePlugins({
            ...this.options,
            entries: this[ENTRIES],
            plugins: this.customConfig.plugins
        })

        this[PLUGINS] = resolved.plugins;
    }

    writeConfigToDisk() {
        const { outputDir, outputName = 'webpack.config.js' } = this.options;

        if(outputDir) {
            const fullPath = path.join(outputDir, outputName)
            const configJson = 'module.exports = ' + JSON.stringify(this.config)
            try {
                require('mkdirp').sync(outputDir);
                fs.writeFileSync(fullPath, configJson)

            } catch(err) {
                console.error(err.stack || err);
            }

            

        }

    }


}

module.exports = WebpackConfig;