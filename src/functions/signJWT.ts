import jwt from 'jsonwebtoken';
import config from '../config/config';
import {UserDocument} from '../interfaces/user';
import AppError from '../utils/appError';


const NAMESPACE = 'SignJWT';

/** signJWT
 * 
 * create JWT for user
 * 
 */

const signJWT = (user: UserDocument): String => {
    return jwt.sign(
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
        }
    )
};

export default { signJWT };