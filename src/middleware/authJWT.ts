import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import User from '../models/user';
import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Auth';

/** extractJWT 
 * 
 * validates if a token exist and is valid
 * saves token at res.locals.jwt
*/

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token' );
    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                logging.error(NAMESPACE,error.message, error);
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                logging.info(NAMESPACE, 'Validated token', token);
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        logging.error(NAMESPACE, 'No token found');
        return res.status(401).json({
            message: 'No token found'
        });
    }
};

/** getJWT 
 * 
 * extracts token
 * saves token at res.locals.jwt
*/

const getJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting token');
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                logging.error(NAMESPACE,error.message, error);
                return res.status(404).json({
                    message: error,
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
 * validates if a token exist and it user has administrator permissions in DB
 * saves token at res.locals.jwt
*/

const validateAdminToken = (req: Request, res: Response, next: NextFunction) => {
    let token = res.locals.jwt;
    let {username, permissions} = token;
    if (token) {
        logging.info(NAMESPACE, `Validating Token for user ${username} with permissions ${permissions}`);
        if (permissions == "Admin"){
            /**check if user is infact authorized in DB */
            User.findOne({username})
                .exec()
                .then((user) => {
                    if (user && user.permissions == "Admin"){
                        logging.info(NAMESPACE,`validated admin token for user ${username} with permissions ${permissions}`);
                    }
                    else {
                        logging.error(NAMESPACE,`No user named ${username} found with permissions ${permissions}`);
                        return res.status(404).json({
                            message: `No user named ${username} found with permissions ${permissions}`
                        });
                    }
                })
                .catch((error) => {
                    logging.error(NAMESPACE,error.message, error);
                    return res.status(404).json({
                        message: error,
                        error
                    });
                });
            
            logging.info(NAMESPACE, 'validated Admin Token for ', username);
            next();
        } 
        else {
            logging.error(NAMESPACE,'No token found for action requiring admin permissions')
            return res.status(401).json({
            message: 'No token found for action requiring admin permissions'
            });
        }
    }
    else {
        logging.error(NAMESPACE,'No token found');
        return res.status(401).json({
            message: 'No token found'
        });
    }
};



export default { extractJWT, getJWT, validateAdminToken };