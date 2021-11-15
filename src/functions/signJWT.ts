import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import IUser from '../interfaces/user';


const NAMESPACE = 'SignJWT';

/** signJWT
 * 
 * create JWT for user
 * 
 */

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {

    logging.info(NAMESPACE, `Attempting to sign token for user ${user.username}`);
    
    try {
        jwt.sign(
            {
                username: user.username,
                permissions: user.permissions
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: "10 days"
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error : any) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default { signJWT };