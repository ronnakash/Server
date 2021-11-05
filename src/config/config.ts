import dotenv from 'dotenv';
import logging from '../config/logging';

const NAMESPACE = 'config';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
};

const mongoose = require('mongoose');
const uri = "mongodb+srv://Admin:pass@mongocluster.8zgcv.mongodb.net/db?retryWrites=true&w=majority";
mongoose.connect(uri, MONGO_OPTIONS)
.then(logging.info('NAMESPACE', 'mongodb connected'))
.catch((error: any) => {
    logging.error('NAMESPACE', 'Error connecting to Database', error);
})




const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'Administrator';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
const config = {
    mongo : mongoose,
    server: SERVER
}

export default config;