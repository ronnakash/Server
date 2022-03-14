import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import UserDocument from '../interfaces/user';
import AppError from '../utils/appError';


const NAMESPACE = 'SignJWT';

/** signJWT
 * 
 * create JWT for user
 * 
 */

const signJWT = (user: UserDocument, callback: (error: Error | null, token: string | null) => void): void => {

    logging.info(NAMESPACE, `Attempting to sign token for user ${user.username}`);
    try {
        jwt.sign(
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
            (error, token) => {
                if (error) {
                    callback(new AppError(`error in signJWT: ${error.message}`, 500), null)
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error : any) {
        callback(error, null);
    }
};

export default { signJWT };