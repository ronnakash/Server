import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { NestMiddleware } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { JWTBody, JWTParams } from '../interfaces/middleware';


const NAMESPACE = 'Auth';


/** existsJWT 
 * 
 * checks if token exists
 * always called after getJWT
 * 
*/


export class ExistsJWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let token = req.body.jwt;
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
 * saves token in request body to pass for use in controllers when neccesary
 * also makes sure that the request body does not contain fradulent token
 * 
*/

export class GetJWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //ensure that the request body doesn't contain a jwt field
        if (req.body.jwt)
            new AppError('No token provided',400)
        //extract token and add it to the request body
        let token = req.headers.authorization?.split(' ')[1];
        if (token) {
            jwt.verify(token, config.server.token.secret,
                (error: VerifyErrors | null, decoded: JwtPayload | undefined) => {
                    if (error) {
                        next(error);
                    } else {
                        req.body.jwt = decoded;
                    }
            });
        }
        next();
        // else next(new AppError('No token provided', 400));
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
        let token = req.body.jwt;
        let {username, permissions} = token;
        if (permissions !== 'Admin')
            next(new AppError(`User ${username} does not have admin permissions`,400));           
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
        let token : JWTParams = req.body.jwt;
        let { permissions, username } = token;
        if (permissions == 'Admin')
            next();
        else if (permissions == 'user') {
            //check if author/username match the username of token
            const requestUser = req.body.author || req.body.username;
            if (requestUser == username)
                next();
            next(`Users without admin permissions can't make actions regarding other users`)
        }
        else
            next(new AppError('No token provided',400)); 
    }
};



