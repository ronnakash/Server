import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

const NAMESPACE = "ResultHandler"


const ResultHandler = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "done!");
    let result = res.locals.result;
    let statusCode = (result? result.statusCode : 500) | 500;
    let len = (result ? result.length : 0);
    return res.status(statusCode).json({
        result: result,
        length: len
    });

}


export default ResultHandler;