// import built-in modules
const fs = require('fs');
const numCPUs = require('os').cpus().length;
// import third-party modules
const cluster = require('cluster');
// import local modules
const app = require('./app');
const config = require('./config').value;
const logger = require('./utils/logger');


function main() {
    if (config.enableCluster && cluster.isMaster && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'dev') {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    } else {
        let server;
        if (config.connect.socket) {
            if (fs.existsSync(config.connect.socket)) {
                fs.unlinkSync(config.connect.socket);
            }
            server = app.listen(config.connect.socket, parseInt(config.listenInaddrAny) ? null : '127.0.0.1');
            logger.info('Listening Unix Socket ' + config.connect.socket);
            process.on('SIGINT', () => {
                fs.unlinkSync(config.connect.socket);
                process.exit();
            });
        }
        if (config.connect.port) {
            server = app.listen(config.connect.port, parseInt(config.listenInaddrAny) ? null : '127.0.0.1');
            logger.info('Listening Port ' + config.connect.port);
        }
    
        logger.info('🎉 RSSHub start! Cheers!');
        logger.info('💖 Can you help keep this open source project alive? Please sponsor 👉 https://docs.rsshub.app/en/support');
    }
}

main();
