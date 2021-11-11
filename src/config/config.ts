import dotenv from 'dotenv';
import logging from '../config/logging';
import secret from './secret'


const NAMESPACE = 'config';


dotenv.config();


//mongoose connect
const mongoose = require('mongoose');
mongoose.connect(secret.mongoUri, secret.MONGO_OPTIONS)
.then(logging.info(NAMESPACE, 'mongodb connected'))
.catch((error: any) => {
    logging.error(NAMESPACE, 'Error connecting to Database', error);
})


const SERVER = {
    hostname: secret.SERVER_HOSTNAME || 'localhost',
    port: secret.SERVER_PORT || 3001,
    token: {
        expireTime: secret.SERVER_TOKEN_EXPIRETIME || 3600,
        issuer: secret.SERVER_TOKEN_ISSUER || 'Administrator',
        secret: secret.SERVER_TOKEN_SECRET || 'tokenSecret'
    }
};


const config = {
    mongo : mongoose,
    server: SERVER
}


export default config;