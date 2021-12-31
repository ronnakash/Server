import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Auth';


/** existsJWT 
 * 
 * checks if token exists
 * always called after getJWT
 * 
*/


const existsJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'verifying token exists');
    let token = res.locals.jwt;
    if (token) {
        next();
    } else {
        /*
        logging.error(NAMESPACE, 'No token found');
        return res.status(401).json({
            message: 'No token found'
        });
        */
        next();
    }
};


/** getJWT 
 * 
 * extracts token and verifies it
 * saves token at res.locals.jwt
 * 
*/


const getJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting token');
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                logging.error(NAMESPACE,error.message, error);
                return res.status(401).json({
                    message: error.message,
                    error
                });
            } else {
                res.locals.jwt = decoded;
            }
        });
    }
    next();
};


/** validateAdminToken 
 * 
 * checks if token has admin permissions
 * always called after getJWT and existsJWT 
 * 
*/


const validateAdminToken = (req: Request, res: Response, next: NextFunction) => {
    let token = res.locals.jwt;
    let {username, permissions} = token;
        logging.info(NAMESPACE, `Validating Token for user ${username} with permissions ${permissions}`);
        if (permissions == 'Admin'){            
            logging.info(NAMESPACE, `validated Admin Token for user ${username} with permissions ${permissions}`);
            next();
        } 
        else {
            logging.error(NAMESPACE,'No admin token found for action requiring admin permissions')
            return res.status(401).json({
            message: 'No admin token found for action requiring Admin permissions',
            token: token
            });
        }
};


/** validateUserOrAdmin 
 * 
 * checks if token user is admin or if token user matches request's first field
 * the first of request field should always be author for notes requests and username for users requests
 * always called after getJWT and existsJWT
 * 
*/


const validateUserOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    let token = res.locals.jwt;
    logging.info(NAMESPACE, 'token: ', token);
    let { username , permissions } = token;
    let { reqUser } = req.body;
    logging.info(NAMESPACE, 'request user: ', reqUser);
    if (permissions == 'Admin') {
        validateAdminToken(req, res, next);
    }
    else if (username == reqUser) {
        logging.info(NAMESPACE, `Token user ${username} does not have admin permissions but match request user ${username}`);
        next();
    }
    else {
        logging.error(NAMESPACE, `Token user ${username} does not have admin permissions and does not match request user ${username}`);
        return res.status(400).json({
            message: `Token user ${username} does not have admin permissions and does not match request user ${username}`,
            tokenUser: username,
            tokenUserPermissions: permissions,
            requestUser: reqUser
        });
    }
};


/** adminIfNeeded 
 * 
 * checks if request contains admin permissions,
 * and if so, verifies that an admin token exists
 * 
*/

const adminIfNeeded = (req: Request, res: Response, next: NextFunction) => {
    let { permissions } = req.body;
    if (permissions) {
        validateAdminToken(req, res, next);
    }
    else {
        next();
    }
};


export default { existsJWT, getJWT, validateAdminToken, validateUserOrAdmin, adminIfNeeded };