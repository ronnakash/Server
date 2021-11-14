import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';

const router = express.Router();


/** create */
router.post('/post/register',JWT.getJWT, JWT.adminIfNeeded, controller.register);
router.post('/post/registerAndLogin',JWT.getJWT, JWT.adminIfNeeded, controller.register, controller.login);
/** read */
router.get('/get/validate', JWT.getJWT, JWT.existsJWT, controller.validateToken);
router.post('/post/login', controller.login);
router.get('/get/all',JWT.getJWT, JWT.existsJWT, JWT.validateAdminToken, controller.getAllUsers);
/** update */
//change password
/** delete */
//delete user


export default { router };