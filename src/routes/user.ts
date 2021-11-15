import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';

const router = express.Router();


/** create */
router.post('/post/register',JWT.getJWT, JWT.adminIfNeeded, controller.register, controller.returnLocals);
router.post('/post/registerAndLogin',JWT.getJWT, JWT.adminIfNeeded, controller.register, controller.safeLogin, controller.returnLocals);
/** read */
router.get('/get/validate', JWT.getJWT, JWT.existsJWT, controller.validateToken);
router.post('/post/login', controller.login);
router.get('/get/all',JWT.getJWT, JWT.existsJWT, JWT.validateAdminToken, controller.getAllUsers);
/** update */
router.post('/post/changePassword', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin ,controller.changePassword);
/** delete */
router.post('/post/deleteUser', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin ,controller.deleteUser);


export default { router };