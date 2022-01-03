import { Request, Response, NextFunction } from 'express';
import { errorMonitor } from 'stream';
import logging from '../config/logging';
import AppError from '../utils/appError';


const NAMESPACE = 'ErrorHandler';

const errorLogger = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error("errorLogger", `${error.message}`, error.stack);
    next(error);
};

const errorResponder = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error("errorResponder", "errorResponder");
    if (error instanceof AppError){
        logging.error("errorResponder", "ValidationError");
        return res.status(500).json({
            message: `${error.message}`,
            error
        });
    }
    else if (error.name === 'ValidationError'){
        logging.error("errorResponder", "ValidationError");
        return res.status(500).json({
            message: `Unhandled error: ${error.message}`,
            error
        });
    }
    else next(error);
};

const uncaughtErrorHandler = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error("uncaughtErrorHandler", `uncaughtErrorHandler`);
    return res.status(500).json({
        message: `Unhandled error: ${error.message}`,
        error
    });
};

export default { errorLogger, errorResponder, uncaughtErrorHandler }