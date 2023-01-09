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
            secret: SERVER_TOKEN_SECRET || "",
        }
    }
}

//mongoose connect
const mongoose = require('mongoose');
mongoose.connect(mongoUri, MONGO_OPTIONS)
.then(console.log('Connected to Database'))
.catch((error: any) => {
    console.log('Error connecting to Database', error);
})

export default config;