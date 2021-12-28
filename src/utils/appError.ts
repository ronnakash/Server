import logging from '../config/logging';

const NAMESPACE = 'AppError Constructor'

class AppError extends Error {
    message : string;
    statusCode: number;
    status: string;
    
    constructor(message: string, statusCode : number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.status  = `${statusCode}`.startsWith('4') ? 'client error' : 'server error';
        Error.captureStackTrace(this);
        logging.error(NAMESPACE, `ERROR: ${this.status} with code ${this.statusCode}\n`, this.stack);
    }

}

export default AppError;