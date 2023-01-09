import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { NestMiddleware } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { JWTBody, JWTParams } from '../interfaces/middleware';


/** existsJWT 
 * 
 * checks if token exists
 * always called after getJWT
 * 
*/


export class ExistsJWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // console.log('ExistsJWTMiddleware');
        let token = req.body.jwt;
        //TODO: make sure next with error works
        if (token) 
            next();
        else throw new AppError(`no token provided`,400);
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
        // console.log('GetJWTMiddleware');
        //ensure that the request body doesn't contain a jwt field
        if (req.body.jwt)
            throw new AppError(`Can't provide JWT in request body`,400)
        //extract token and add it to the request body
        let token = req.headers.authorization?.split(' ')[1];
        if (token) {
            jwt.verify(token, config.server.token.secret || "",
                (error: any, decoded: any) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    } else {
                        req.body.jwt = decoded;
                    }
            });
        }
        next();
        // throw new AppError('No token provided', 400);
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
        // console.log('ValidateAdminTokenMiddleware');
        let token = req.body.jwt;
        let {username, permissions} = token;
        if (permissions !== 'Admin')
            throw new AppError(`User ${username} does not have admin permissions`,400);           
        else next();
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
        // console.log('ValidateUserOrAdminMiddleware');
        let body = req.body;
        let token : JWTParams = body.jwt;
        let { permissions, email } = token;
        if (permissions == 'Admin')
            next();
        //check if author/username match the username of token
        const requestUser = body.author || body.email;
        if (requestUser == email)
            next();
        else throw new AppError(`Users without admin permissions can't make actions regarding other users`,400); 
    }
};

