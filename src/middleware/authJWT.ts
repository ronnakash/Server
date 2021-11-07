import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import User from '../models/user';
import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Auth';

//validates if a token exist and saves token at res.locals.jwt
const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token' );

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'No token found'
        });
    }
};


//extracts token and saves token at res.locals.jwt
const getJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting token');
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
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


//validates if a token exist and it user has administrator permissions in DB and saves token at res.locals.jwt
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
                        return res.status(404).json({
                            message: `No user named ${username} find  with permissions ${permissions}`
                        });
                    }
                })
                .catch((error) => {
                    return res.status(404).json({
                        message: error,
                        error
                    });
                });
            
            logging.info(NAMESPACE, 'validated Admin Token', username);
            next();
        } 
        else {
            return res.status(401).json({
            message: 'No token found for action requiring admin permissions'
            });
        }
    }
    else {
        return res.status(401).json({
            message: 'No token found'
        });
    }
};








export default { extractJWT, getJWT, validateAdminToken };