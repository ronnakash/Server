import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import JWT from '../functions/signJWT';
import User from '../models/user';

const NAMESPACE = 'User';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** create */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** register
 * 
 * 
 */

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password, permissions} = req.body;

    /** check if token user is authorized to create a new user with permissions */
    if (permissions) {
        User.find({ username }, 'username createdAt')
            .exec()
            .then((users) => {
                if (users.length == 0) {
                    bcryptjs.hash(password, 11, (hashError, hash) => {
                        if (hashError) {
                            return res.status(401).json({
                                message: hashError.message,
                                error: hashError
                            });
                        }
                        const _user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username,
                            password: hash,
                            permissions
                        });
                        return _user
                            .save()
                            .then((user) => {
                                return res.status(201).json({
                                    user
                                });
                            })
                            .catch((error) => {
                                return res.status(500).json({
                                    message: error.message,
                                    error
                                });
                            });
                    });
                }  
            });
    }    
    else {
        logging.error(NAMESPACE, `Username ${username} taken`);
        return res.status(401).json({
            message: `Username ${username} taken! try a different one`
        });
    }
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** update */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** read */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** login
 * 
 * 
 */

const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    User.find({ username })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Username does not exist'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                } else if (result) {
                    JWT.signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token,
                                user: users[0]
                            });
                        }
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

/** getAllUsers
 * 
 * 
 */

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('username createdAt permissions')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


/** validateToken
 * 
 * 
 */

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};








export default { validateToken, register, login, getAllUsers };