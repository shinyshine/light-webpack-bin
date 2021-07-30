const chalk = require("chalk");
const LightBin = require('../LightBin');


class LightBuild {
    constructor(opts) {
        this.opts = opts;
    }

    run() {

        console.log(chalk.green('run light-bin build'))
        console.log(this.opts)

        new LightBin(this.opts).build()
    }
}

module.exports = LightBuild;