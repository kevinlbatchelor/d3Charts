let publicKey = `-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`;

let productionKey = `-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`;

let grayLog = {
    host: 'graylogapi.alpha.dev.insidesales.com',
    port: '12201'
};

let server = {
    host: 'localhost',
    port: 3000
};

let config = {
    dev: {
        idmPublicKey: publicKey,
        graylog: grayLog,
        server: server,
        database: {
            host: 'localhost',
            port: '5432',
            username: 'battlecarduser',
            password: 'a',
            name: 'battlecards',
        }
    },
    prod: {
        idmPublicKey: productionKey,
        graylog: grayLog,
        server: server,
        database: {
            host: process.env.DB_HOST_ENV,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PW,
            name: 'battlecards',
        }
    },
    local: {
        idmPublicKey: publicKey,
        graylog: grayLog,
        server: server,
        database: {
            host: 'localhost',
            port: 5432,
            name: 'battlecards',
            username: 'postgres',
            password: 'a'
        }
    }
};

const exportConfig = function () {
    return config[process.env.NODE_ENV]
};

module.exports = exportConfig();