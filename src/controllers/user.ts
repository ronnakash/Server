import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import JWT from '../functions/signJWT';
import User from '../models/user';
import Query from '../utils/query';
import AppError from '../utils/appError';
import validator from 'validator';
import urlParser from '../utils/urlParser';
import axios from 'axios'
import config from '../config/secret'
import jwt from 'jsonwebtoken';
import IUser, {IUserProps} from '../interfaces/user';
import bcryptjs from 'bcryptjs';

const NAMESPACE = 'User';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** create */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** new user
 * 
 * 
 * 
 */


const NewUser = async ( user : IUserProps ) => {
    return await Query
        .createOne(User, new User(user))
        .catch( error => {throw error});
}


/** register
 * 
 * register a new user
 * 
 * if you want to create a user with admin permissions,
 * request must contain token with admin permissions
 * 
 */


async function register (req: Request, res: Response, next: NextFunction) {
    logging.info(NAMESPACE,"hi")
    let { username, email, password, permissions } = req.body;
    let token = res.locals.jwt;
    //check if user exists
    let users = await Query
        .getMany(User, {find: email})
        .catch( error => next(error));
    if (users && users.length > 0)
        next(new AppError(`User already exists: ${users[0]}`,400));
    // check that password is strong
    else if (!validator.isStrongPassword(password))
        next(new AppError(`Provided password for user ${username} is too weak`, 400));
    //check token user permission
    else if (permissions === 'Admin' && !(token.permissions === 'Admin'))
        next(new AppError(`You are not authorised to create Admin users!`,400));
    else {
        const userProps : IUserProps = {
            username,
            email,
            password,
            permissions
            };
        const user = await NewUser(userProps).catch(err=>next(err));
        res.locals.result = {
            message: `Created new user ${username} sucsessfuly`,
            user: user
        }
/**     
        const newUserr = new User({
            username,
            email,
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
        */
        next();
    }
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
    let { username, email, oldPassword, newPassword } = req.body;
    //get user from database
    const user = await Query
        .getOne(User, {find: {username: username, email: email}, select: '+passwordChangedAt, +password'})
        .catch( error => next(error));;
    if (user) {
        //compare passwords
        if (!(await bcryptjs.compare(oldPassword, user.password))) 
            next(new AppError(`Password mismatch for ${username}`,400));
        else if (oldPassword !== newPassword)
            next(new AppError(`Can't change password to the current one`,400));
        // validate new password strength
        else if (!validator.isStrongPassword(newPassword))
            next(new AppError(`New password for user ${username} is too weak`, 400));
        else {
            user.password = newPassword;
            user.passwordChangedAt = Date.now();
            await user
                .save()
                .catch( error => next(error));
            user.password = ""; // hide password hash
            res.locals.result = {
                message: `Changed password successfuly for user ${username}`,
                user: user
            };
        }
    }
    next();
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
    let { username, email, password } = req.body;
    let ter = User.find().exec().catch( error => next(error));
    const user = await Query
        .getOne(User, {find: {username: username, email: email}, select: '+password'})
        .catch( error => next(error));
    logging.info(NAMESPACE,"user:", user);
    if (user) {
        if (!await bcryptjs.compare(password, user.password))
            next(new AppError(`password mismatch for user ${username}`, 400));
        JWT.signJWT(user, (error, token) => {
            if (error) next(error);
            else if (token) {
                logging.info(NAMESPACE,`Auth successful for ${username}`);
                user.password = "";
                res.locals.result = {
                    message: `Auth successful for ${username}`,
                    token: token,
                    user: user
                };
                next();
            }
        });
    }
    else next(new AppError(`Unexpected error in login: query result is not a user`, 500));
};


/** safeLogin 
 * 
 * login user right after user creation
 * does not compare password to database
 * 
*/

const safeLogin = async (req: Request, res: Response, next: NextFunction) => {
    let newUser = res.locals.result.user;
    JWT.signJWT(newUser, (error, token) => {
        if (error) next(error);
        else if (token) {
            logging.info(NAMESPACE,`Auth successful for ${newUser.username}`);
            res.locals.result = {
                loginMessage: `Auth successful for ${newUser.username}`,
                token: token,
                user: newUser
            };
            next();
        }
    });
};

/** googleLogin
 * 
 * 
 */

const googleCodeExchage = async (req: Request, res: Response, next: NextFunction) => {
    let {code} = req.body;
    let {GOOGLE_CODE_EXCHANGE_REQUEST_CONFIG, GOOGLE_TOKEN_URI} = config.googleLoginConfig;
    logging.debug(NAMESPACE,'dbg',req.body);
    //code exchange request definition
    const googleCodeExchangeRequest = axios.create({
        method: 'POST',
        baseURL: GOOGLE_TOKEN_URI,
        timeout: 5000
    });
    //code exchange request
    const googleResponse = await googleCodeExchangeRequest
        .post('', {
            code,
            ...GOOGLE_CODE_EXCHANGE_REQUEST_CONFIG
        }).catch( error => {
            logging.info(NAMESPACE, `error in axios!!`)
            next(error);
        });
    //if exchange successful
    if (googleResponse){
        logging.info(`response \n`, googleResponse.data);
        let {access_token, id_token} = googleResponse.data;
        logging.info(NAMESPACE, `access token: ${access_token}\nid token:${id_token}`)
        const decodedIdToken : any = jwt.decode(id_token);
        logging.info(NAMESPACE,`decoded:`, decodedIdToken);
        res.locals.result = {
            token: decodedIdToken
        };
        next();
    }
    
};

const googleRegister = async (req: Request, res: Response, next: NextFunction) => {
    let {name, email, picture} = res.locals.result.token;
    let users = await Query
        .getMany(User, {find: {email}})
        .catch( error => next(error));
    if (users){
        logging.info(NAMESPACE,'user document:', users[0]);
        res.locals.result = {
            message: `Found google user ${name} sucsessfuly`,
            user: users[0], 
            new: false
        };
    }
    else{
        const userProps : IUserProps = {
            username: name,
            email,
            permissions: 'user',
            picture
            };
        const user = await NewUser(userProps).catch(err=>next(err));
        res.locals.result = {
            message: `Created new user ${name} sucsessfuly`,
            user: user, 
            new: true
        };
    }
    next();
};




/** getAllUsers
 * 
 * get a list of all users
 * requires admin permissions
 * 
 */

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    let {find, select, sort} = req.body;
    let users = await Query
        .getMany(User, {find, select, sort})
        .catch( error => next(error));
    logging.info(NAMESPACE,"hi");
    res.locals.result = {
        message: users? `Got ${users.length} results` : `Unexpected error in getAllUsers`,
        users: users,
        statusCode: users? 200 : 500
    }
    next();
};






export default { register, deleteUser, changePassword, login, getAllUsers, safeLogin, googleCodeExchage, googleRegister};