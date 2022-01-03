import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import JWT from '../functions/signJWT';
import User from '../models/user';
import Query from '../utils/query';
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
    let {token} = res.locals.jwt;
    // check that password is strong
    if (!validator.isStrongPassword(password)){
        next(new AppError(`Provided password for user ${username} is too weak`, 400));
    }
    //check token user permission
    if (permissions ==='Admin' && !(token.tokenUserPermissions === 'Admin'))
        next(new AppError(`You are not authorised to create Admin users!`,400));
    const hash = await bcryptjs.hash(password, 11);
    const newUser = new User({
        username,
        password: hash,
        permissions
        });
    const user = await Query
        .createOne(User, newUser)
        .catch( error => next(error));
    res.locals.result = {
        message: `Created new user ${username} sucsessfuly`,
        user: user
    }
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
    let user = await Query
        .deleteOne(User, {find: {username: username}})
        .catch( error => next(error));
    res.locals.result = {
        message: `Deleted user ${username}`,
        user: user
    }
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
    const user = await Query
        .getOne(User, {find: {username: username}})
        .catch( error => next(error));;
    if (user instanceof User) {
        //compare passwords
        if (!bcryptjs.compare(oldPassword, user.password)) 
            next(new AppError(`Password mismatch for ${username}`,400));
        // validate new password strength
        if (!validator.isStrongPassword(newPassword)){
            next(new AppError(`New password for user ${username} is too weak`, 400));
        }
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        user.save().catch( error => next(error));
        res.locals.result = {
            message: `Changed password successfuly for user ${username}`,
            user: user
        };
    }
    next();
    
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
    const user = await Query
        .getOne(User, {find: {username: username}})
        .catch( error => next(error));
    if (user instanceof User) {
        if (!await bcryptjs.compare(password, user.password))
            next(new AppError(`password mismatch for user ${username}`, 400));
        JWT.signJWT(user, (error, token) => {
            if (error) next(error);
            else if (token) {
                logging.info(NAMESPACE,`Auth successful for ${username}`);
                res.locals.result = {
                    message: `Auth successful for ${username}`,
                    token: token,
                    user: user
                };
            }
        });
        next();
    }
    next(new AppError(`Unexpected error in login: query result is not a user`, 500));
};


/** safeLogin 
 * 
 * login user right after user creation
 * does not compare password to database
 * 
*/

const safeLogin = (req: Request, res: Response, next: NextFunction) => {
    let newUser = res.locals.result.user;
    JWT.signJWT(newUser, (error, token) => {
        if (error) next(error);
        else if (token) {
            logging.info(NAMESPACE,`Auth successful for ${newUser.username}`);
            res.locals.result = {
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

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    let users = await Query
        .getMany(User, {select: 'username email permissions createdAt'})
        .catch( error => next(error));
    logging.info(NAMESPACE,"hi");
    res.locals.result = {
        message: users? `Got ${users.length} results` : `Unexpected error in getAllUsers`,
        users: users,
        statusCode: users? 200 : 500
    }
    next();
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






export default { validateToken, register, deleteUser, changePassword, login, getAllUsers, safeLogin };