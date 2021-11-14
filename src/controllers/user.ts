import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import JWT from '../functions/signJWT';
import User from '../models/user';
import authJWT from '../middleware/authJWT'

const NAMESPACE = 'User';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** create */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** register
 * 
 * register a new user
 * 
 * if you want to create a user with admin permissions,
 * request must contain token with admin permissions
 * 
 */


async function register (req: Request, res: Response, next: NextFunction) {
    let { username, password, permissions} = req.body;
    const hash = await bcryptjs.hash(password, 11);
     new User({
        username,
        password: hash,
        permissions
        })
            .save()
            .then((user) => {
                logging.info(NAMESPACE, `registered new user ${username} with permissions ${permissions}`);
                return res.status(200).json({
                    registerMessage: `registered new user ${username} with permissions ${permissions}`, 
                    registerUser: user
                });
                next();
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** deleteUser
 * 
 * deletes user from database by username
 * requires admin permissions or token user must match username to delete
 * request must contain username to delete
 * 
 */

 const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    let { username } = req.body;
    User.deleteOne()
        .select ('-password')
        .exec()
        .then((user) => {
            logging.info(NAMESPACE, `Deleted user ${username}`, user);
            return res.status(200).json({
                message: `Deleted user ${username}`,
                user
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });

 }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** update */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** changePassword
 * 
 * changes a users password in database
 * requires admin permissions or token user must match username to update it's password
 * request must contain username and old and new passwords
 * old password provided must match password in database
 * 
 */

async function changePassword (req: Request, res: Response, next: NextFunction) {
    let { username, oldPassword, newPassword } = req.body;
    //get user from database
    const user = await User.findOne({username})
        .exec()
        .catch((error) => {
            logging.error(NAMESPACE,error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });

    if(user && user instanceof User && oldPassword != newPassword) {
        // compare passwords
        bcryptjs.compare(oldPassword, user.password, (error, success) => {
            if (error) {
                logging.error(NAMESPACE,error.message, error);
                return res.status(500).json({
                    message: error.message,
                    error
                });
            }
            else if (!success){
                logging.error(NAMESPACE, `password mismatch for user ${username}`);
                return res.status(500).json({
                    message: `password mismatch for user ${username}`,
                    oldPasswordProvided: oldPassword
                });
            } 
            else { //success 
                User.updateOne({username}, {password: newPassword})
                    .select('-password')
                    .exec()
                    .then((user) => {
                        logging.info(NAMESPACE,`changed password successfully for user ${username}`);
                        return res.status(200).json({
                            message: `changed password successfully`,
                            user: user,
                            newPassword: newPassword
                        });
                    })
                    .catch ((error) => {
                        logging.error(NAMESPACE, error.message, error);
                        res.status(500).json({
                            message: error.message,
                            error
                        });
                    })
            }
        });
    }
    else if (oldPassword == newPassword) {
        logging.error(NAMESPACE, `trying to change password to current password for user ${username}`);
        return res.status(500).json({
            message: `trying to change password to current password for user ${username}`,
            oldPasswordProvided: oldPassword, 
            newPassword: newPassword
        });
    }
    else {
        logging.error(NAMESPACE,`user ${username} not found`);
        return res.status(400).json({
            message: `user ${username} not found`
        });
    }
 };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** read */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** login
 * 
 * attempt to log a user in and create a token for the user
 * request body must conain username and password
 * 
 */

const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    User.findOne({ username })
        .exec()
        .then((user) => {
            if (user){
                bcryptjs.compare(password, user.password, (error, result) => {
                    if (error) {
                        logging.error(NAMESPACE, error.message, error);
                        return res.status(401).json({
                            message: 'Password mismatch',
                            error
                        });
                    } else if (result) {
                        JWT.signJWT(user, (error, token) => {
                            if (error) {
                                return res.status(500).json({
                                    message: error.message,
                                    error: error
                                });
                            } else if (token) {
                                return res.status(200).json({
                                    loginMessage: 'Auth successful',
                                    token: token,
                                    loginUser: user
                                });
                            }
                        });
                    }
                });
            }
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            res.status(500).json({
                message: error.message,
                error
            });
        });
};

/** getAllUsers
 * 
 * get a list of all users
 * requires admin permissions
 * 
 */

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('username permissions createdAt')
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
 * validates that token user exists and validates it
 * actual verification happens before by middleware
 * returns confirmation message if token is valid
 * 
 */

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};








export default { validateToken, register, login, getAllUsers };