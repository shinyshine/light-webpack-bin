const yargs = require('yargs');
// const parser = require('yargs-parser');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const DISPATCH = Symbol('Command#dispatch');
const ACTION = Symbol('Command#action');



class Command {
    constructor() {
        this.cmdPath = path.join(__dirname, 'cmd');
        this.rawArgs = process.argv.slice(2);

        this.yargs = yargs(this.rawArgs);
        this.argv = this.yargs.argv;

        this[ACTION] = new Map();

        console.log(this.yargs.argv);

        this.loadCommands();
    }

    loadCommands() {
        const cmdPath = this.cmdPath;
        const files = fs.readdirSync(this.cmdPath);

        files.forEach(filename => {
            // 只解析.js文件
            if(path.extname(filename) === '.js') {
                const cmdName = path.basename(filename).replace(/\.js$/, '');
                const cmdFullPath = path.join(cmdPath, filename);

                const cmdCls = require(cmdFullPath);

                this[ACTION].set(cmdName, cmdCls);

            }
        })

    }




    [DISPATCH]() {
        this.yargs
            .completion()
            .help()
            .version()
            .alias('h', 'help');

        const actionName = this.argv._[0];
        if(this[ACTION].has(actionName)) {
            const action = this[ACTION].get(actionName);
            const options = this.yargs.parse(this.rawArgs);

            const cmd = new action(options);
            cmd.run();
            return;
        }

        console.error(chalk.red(`Command ${actionName} is not existed`));
    
    }



    start() {
        this[DISPATCH]();

    }
}

module.exports = Command;
