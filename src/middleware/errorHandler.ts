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
        logging.error("errorResponder", "AppError");
        return res.status(500).json({
            message: `${error.message}`,
            error
        });
    }
    else if (error.name === 'ValidationError'){
        logging.error("errorResponder", "ValidationError");
        return res.status(400).json({
            message: `Validation Error: ${error.message.split(':'[1])}`,
            error
        });
    }
    else if (error.name === 'ObjectParameterError'){
        logging.error("errorResponder", "ObjectParameterError");
        return res.status(400).json({
            message: `Object Parameter Error: ${error.message.split(':'[1])}`,
            error
        });
    }
    else if (error.name === 'CastError'){
        logging.error("errorResponder", "CastError");
        return res.status(500).json({
            message: `Casting Error: ${error.message.split(':'[1])}`,
            error
        });
    }
    else if (error.name === 'SyntaxError'){
        logging.error("errorResponder", "SyntaxError");
        return res.status(400).json({
            message: `Syntax Error: ${error.message.split(':'[1])}`,
            error
        });
    }
    else next(error);

};

const uncaughtErrorHandler = (error : Error, req: Request, res: Response, next: NextFunction) => {
    logging.error("uncaughtErrorHandler", `uncaughtErrorHandler`, error);
    return res.status(500).json({
        message: `Unhandled error: ${error.message}`,
        error
    });
};

export default { errorLogger, errorResponder, uncaughtErrorHandler }