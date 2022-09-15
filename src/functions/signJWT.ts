import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import {UserDocument} from '../interfaces/user';
import AppError from '../utils/appError';


const NAMESPACE = 'SignJWT';

/** signJWT
 * 
 * create JWT for user
 * 
 */

const signJWT = (user: UserDocument): String => {

    // logging.info(NAMESPACE, `Attempting to sign token for user ${user.username}`);
    try {
        const tokenString = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                email: user.email,
                permissions: user.permissions
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: "30 days"
            },
            // (error, token) => {
            //     if (error) {
            //         throw new AppError(`error in signJWT: ${error.message}`, 500)
            //     } else if (token) {
            //         return token;
            //     }
            // }
        );
        return tokenString;
    } catch (error : any) {
        logging.error(NAMESPACE, `Attempting to sign token for user ${user.username} failed`);
        throw error;
    }
};

export default { signJWT };