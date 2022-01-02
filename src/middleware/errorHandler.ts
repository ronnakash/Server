import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';


const NAMESPACE = 'ErrorHandler';

const errorLogger = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, "errorLogger", error.message);
    next(error);
};

const errorResponder = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, "errorResponder", error.message);
    next(error);
};

const uncaughtErrorHandler = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, `uncaughtErrorHandler`);
    return res.status(500).json({
        message: `Unhandled error: ${error.message}`,
        error
    });
};

export default { errorLogger, errorResponder, uncaughtErrorHandler }