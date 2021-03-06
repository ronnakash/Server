import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging  from './config/logging';
import config from './config/config';
import AppError from './utils/appError';
import adminRouter from './routes/authAdmin';
import userRouter from './routes/authUser'
import errorHandler from './middleware/errorHandler';
import * as dotenv from 'dotenv';


dotenv.config({path:`${__dirname}/.env`});

//require('dotenv').config();

const NAMESPACE = 'Server';
const app = express();


/** logging request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })
    next();
});


/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});


/** Routes */

app.use('/Admin', adminRouter.router);
app.use('/User', userRouter.router);



/** Error logging */
app.use((req, res, next) => {
    const appError = new AppError('not found', 404);
    return res.status(appError.statusCode).json({
        appError
    });
})

app.use(errorHandler.errorLogger);
app.use(errorHandler.errorResponder);
app.use(errorHandler.uncaughtErrorHandler);


/** Server */
const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));


process.on('unhandledRejection', (error) => {
    logging.error(NAMESPACE,`Unhandled rejection ${error}`, error)
});


process.on('uncaughtException', (error) => {
    logging.error(NAMESPACE,`Uncaught exception ${error}`)
});


export default app ;