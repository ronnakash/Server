import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

const NAMESPACE = "ResultHandler"


const ResultHandler = (req: Request, res: Response, next: NextFunction) => {
    let result = res.locals.result;
    logging.info(NAMESPACE, "", result);
    let statusCode = (result? result.statusCode : 200) | 200;
    res.locals.span.end();
    return res.status(statusCode).json({
        ...result
    });

}


export default ResultHandler;