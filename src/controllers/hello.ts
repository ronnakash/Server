import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import IHello from '../interfaces/hello';


const sayHello = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = logging.getTimeStamp(); 
    const message = 'Hello World';

    const response : IHello = ({
        message : message,
        sentTime : timestamp
    });

    return res.status(201).json({
        response: response
    });


}



export default { sayHello };