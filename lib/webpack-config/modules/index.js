
const jsRule = require('./js-module/rules');
const RULES = Symbol('Light#Rule')
const MODULE = Symbol('Light#Module');
const _ = require('lodash');

// module.exports = [
//     {
//         include: ['.js', '.jsx'], // 桥接点 链接custom rule 和 default rule
//         rule: jsRule
//     },
//     {
//         include: ['.ts', '.tsx'], // 桥接点 链接custom rule 和 default rule
//         rule: tsRule
//     },
//     {
//         include: ['.css', '.scss', '.less'],
//         rule: cssRule
//     }
// ]

class ModuleRules {
    /**
     * 
     * @param {*} options 
     * @param {string} options.mode 
     * @param {*} options 
     */
    constructor(customModule, options) {
        this.customModule = customModule || {};
        this.options = options;

        this[RULES] = [];



        this.loadRule(jsRule, '.js', '.jsx');
        // this.loadRule(tsRule, '.ts', '.tsx');
        // this.load(cssRule, '.css', '.less');

        this.mergeRules();
    }

    get rules() {
        return this[RULES];
    }

    get module() {
        if(this[MODULE]) {
            return this[MODULE];
        }

        this[MODULE] = {
            ...this.customModule,
            rules: [...this[RULES]],
        }
        return this[MODULE];

    }

    loadRule(rule, ...include) {
        const customRules = this.customModule.rules;

        let _rule;
        let suffix;
        let shouldBreak;

        if(!customRules) {
            this[RULES].push(rule);
            return;
        } 

        do {
            suffix = include.shift();
            for(let i = 0; i < customRules.length; i ++) {
                _rule = customRules[i];
                if(_rule.test.test(suffix)) {
                    shouldBreak = true;
                    customRules.splice(i, 1);

                    break;
                }
            }
        } while(suffix && !shouldBreak)


        const resolvedRule = this.resolveRule(rule, _rule);

        this[RULES].push(resolvedRule);

    }

    resolveRule(rule, _rule) {
        
        const loaders = rule.use;
        const _loaders = _rule.use;

        loaders.forEach(loader => {
            const _loader = _loaders.find((i, index) => {
                if(i.loader === loader.loader) {
                    _loaders.splice(index, 1)
                    return i;
                }
            });

            loader.options = {
                ...loader.options,
                ..._loader.options
            }
        })

        return {
            ...rule,
            ..._rule,
            test: rule.test,
            use: [
                ...loaders,
                ..._loaders // the rest
            ]
        };



    }


    mergeRules() {
        if(this.customModule.rules.length) {
            this[RULES].push(
                [...this.customModule.rules]
            )

        }
        
    }


}

module.exports = ModuleRules;