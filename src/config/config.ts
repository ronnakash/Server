import logging from '../config/logging';
import {mongoUri,
        MONGO_OPTIONS,
        SERVER_HOSTNAME, 
        SERVER_PORT,
        SERVER_TOKEN_EXPIRETIME,
        SERVER_TOKEN_ISSUER,
        SERVER_TOKEN_SECRET
    } from './secret'


const NAMESPACE = 'config';



//mongoose connect
const mongoose = require('mongoose');
mongoose.connect(mongoUri, MONGO_OPTIONS)
.then(logging.info(NAMESPACE, 'mongodb connected'))
.catch((error: any) => {
    logging.error(NAMESPACE, 'Error connecting to Database', error);
})


const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET,
    }
};


const config = {
    mongo : mongoose,
    server: SERVER
}


export default config;