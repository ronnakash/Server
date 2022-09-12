import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { NestMiddleware } from '@nestjs/common';


const NAMESPACE = 'Auth';


/** existsJWT 
 * 
 * checks if token exists
 * always called after getJWT
 * 
*/


export class ExistsJWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let token = res.locals.jwt;
        //TODO: make sure next with error works
        if (token) 
            next();
        else 
            next(new AppError(`no token provided`,400));
    }
};



/** getJWT 
 * 
 * extracts token and verifies it
 * saves token at res.locals.jwt
 * 
*/

export class GetJWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let token = req.headers.authorization?.split(' ')[1];
        if (token) {
            jwt.verify(token, config.server.token.secret,
                (error: VerifyErrors | null, decoded: JwtPayload | undefined) => {
                    if (error) {
                        next(error);
                    } else {
                        res.locals.jwt = decoded;
                        next();
                    }
            });
        }
        else next(new AppError('No token provided', 400));
    }    
};






/** validateAdminToken 
 * 
 * checks if token has admin permissions
 * always called after getJWT and existsJWT 
 * 
*/


export class ValidateAdminTokenMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        let token = res.locals.jwt;
        let {username, email, permissions} = token;
        if (permissions !== 'Admin')
            next(new AppError(`User ${username} does not have admin permissions`,400));           
        logging.info(NAMESPACE, `validated Admin Token for user ${username} with permissions ${permissions}`);
        next();
    }
};



/** validateUserOrAdmin 
 * 
 * checks if token user is admin or if token user matches request's first field
 * the first of request field should always be author for notes requests and username for users requests
 * always called after getJWT and existsJWT
 * 
*/

export class ValidateUserOrAdminMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        let token = res.locals.jwt;
        let { permissions } = token;
        if (permissions == 'Admin' || permissions == 'user')
            next();
        else
            next(new AppError('No token provided',400)); 
    }
};





// export default { existsJWT, getJWT, validateAdminToken, validateUserOrAdmin };