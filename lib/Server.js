const chalk = require('chalk');
const getFreePort = require('detect-port');
const WebpackDevServer = require('webpack-dev-server');

const SERVER = Symbol('Light#server')

class Server {
    constructor(compiler, options) {
        this.compiler = compiler;
        this.options = options;

        this[SERVER] = this.createServer();
    }

    createServer() {
        const server = new WebpackDevServer(
            this.compiler,
            this.options
        )

        return server;
    }

    detectPort(_port) {
        return getFreePort(_port)
            .then(port => {
                console.log(chalk.green('detect free port ', port))
                return port
            })
            .catch(err => {
                console.log(chalk.red('no avaliable port exist'));
                process.exit(1);
            })
    }


    start() {
        this.detectPort(this.options.port).then(port => {
            this[SERVER].listen(port, '127.0.0.1', (err) => {
                if(!err) {
                    console.log(chalk.blue('server start at ', port))
                }
            })
        })
    }
}

module.exports = Server;