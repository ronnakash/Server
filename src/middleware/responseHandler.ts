import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

const NAMESPACE = "Handler"

const ErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, 'error handler')
    let result = res.locals.result;
    if (result instanceof AppError){
        logging.info(NAMESPACE, 'error!:' + result)
        return res;
    }
    else{
        logging.info(NAMESPACE, 'error handler done')
        next();
    }
        

}

const ResultHandler = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'result handler')
    let result = res.locals.result;
    let statusCode = result.statusCode
    return res.status(statusCode).json({
        result: result,
        length: result.length
    });

}


export default {ErrorHandler, ResultHandler};