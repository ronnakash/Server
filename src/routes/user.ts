import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';

const router = express.Router();


/** create */
router.get('/post/register',JWT.getJWT, JWT.validateAdminToken, controller.register);
/** read */
router.get('/get/validate', JWT.extractJWT, controller.validateToken);
router.get('/post/login', controller.login);
router.get('/get/all', JWT.extractJWT, controller.getAllUsers);
/** update */
//chane password
/** delete */
//delete user


export default { router };