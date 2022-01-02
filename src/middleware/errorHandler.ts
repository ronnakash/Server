import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';


const NAMESPACE = 'ErrorHandler';

const errorLogger = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, error.message, error);
    next();
};

const errorResponder = (error : Error, req: Request, res: Response, next: NextFunction) => {

    next();
};

const uncaughtErrorHandler = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, `Unhandled error: ${error.message}`);
    return res.status(500).json({
        message: `Unhandled error: ${error.message}`,
        error
    });
};

export default { errorLogger, errorResponder, uncaughtErrorHandler }