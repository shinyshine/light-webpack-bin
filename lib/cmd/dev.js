const chalk = require("chalk");
const LightBin = require('../LightBin');


class LightDev {
    constructor(opts) {
        // 命令行参数
        this.opts = opts;
    }


    run() {
        // run dev

        console.log(chalk.green('run light-bin dev'))
        console.log(this.opts);

        new LightBin(this.opts).dev()
    }

}

module.exports = LightDev;