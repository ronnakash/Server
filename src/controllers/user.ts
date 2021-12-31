import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import JWT from '../functions/signJWT';
import User from '../models/user';
import Query from './query';
import AppError from '../utils/appError';
import IUser from '../interfaces/user';
import { Document } from 'mongoose';
import validator from 'validator';


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
    if (!validator.isStrongPassword(password)){
        res.locals.result = new AppError(`Provided password for user ${username} is too weak`, 500);
        next();
    }
    const hash = await bcryptjs.hash(password, 11);
    const newUser = new User({
        username,
        password: hash,
        permissions
        });
    res.locals.result = await Query.createOne(User, newUser);
    next();
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

 const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    let { username } = req.body;
    res.locals.result = await Query.deleteOne(User, {find: {username: username}});
    next();
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
    const user = await Query.getOne(User, {find: {username: username}});
    if (!user || user instanceof AppError){
        res.locals.result = new AppError(`Error finding user ${username}`,500);
        next();
    }
    //compare passwords
    if (!bcryptjs.compare(oldPassword, user.password)) {
        
    }
    
    
    
    
    
    /*
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
    */
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

const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    const user = await User.findOne({username: username}).exec();
    if (!user) {
        res.locals.result = new AppError(`user ${username} not found`, 400);
        next();
    }
    else {
        if (!await bcryptjs.compare(password, user.password)) {
            res.locals.result = new AppError(`password mismatch for user ${username}`, 400);
            next();
        }
        JWT.signJWT(user, (error, token) => {
            if (error) {
                res.locals.result = new AppError(`Error while logging in user ${username} in singJWT:\n${error.message}`, 500);
                next();
            } else if (token) {
                logging.info(NAMESPACE,`Auth successful for ${username}`);
                res.locals.result = {
                    message: `Auth successful for ${username}`,
                    token: token,
                    user
                };
            }
        });
    }



};


/** safeLogin 
 * 
 * login user right after user creation
 * does not compare password to database
 * 
*/

const safeLogin = (req: Request, res: Response, next: NextFunction) => {
    let newUser = res.locals.user;
    JWT.signJWT(newUser, (error, token) => {
        if (error) {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error: error
            });
        } else if (token) {
            logging.info(NAMESPACE,`Auth successful for ${newUser.username}`);
            res.locals.login = {
                loginMessage: `Auth successful for ${newUser.username}`,
                token: token,
                loginUser: newUser
            };
            next();
        }
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


/** returnLocals 
 * 
 * return objects saved in res.locals
 * used for logging in right after registering new user
 * 
*/

const returnLocals = (req: Request, res: Response, next: NextFunction) => {
    let { registered , login } = res.locals;
    if (registered && login) {
        return res.status(200).json({
            registered, 
            login
        });
    } else if (registered) {
        return res.status(200).json({
            registered
        });
    } else {
        logging.error(NAMESPACE,"Internal server error logging in or registering new user");
        return res.status(500).json({
            message:"Internal server error logging in or registering new user"
        })
    }

};





export default { validateToken, register, deleteUser, changePassword, login, getAllUsers, returnLocals, safeLogin };