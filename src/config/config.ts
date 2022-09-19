import {mongoUri,
        MONGO_OPTIONS,
        SERVER_HOSTNAME, 
        SERVER_PORT,
        SERVER_TOKEN_EXPIRETIME,
        SERVER_TOKEN_ISSUER,
        SERVER_TOKEN_SECRET
    } from './secret'


const config = {
    server: {
        hostname: SERVER_HOSTNAME,
        port: SERVER_PORT,
        token: {
            expireTime: SERVER_TOKEN_EXPIRETIME,
            issuer: SERVER_TOKEN_ISSUER,
            secret: SERVER_TOKEN_SECRET,
        }
    }
}


export default config;