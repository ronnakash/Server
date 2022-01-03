import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';
import handler from '../middleware/responseHandler';


const router = express.Router();


/** create */
router.post('/post/register', controller.register);
router.post('/post/registerAndLogin', controller.register, controller.safeLogin);
/** read */
router.get('/get/validate', controller.validateToken);
router.post('/login', controller.login);
router.get('/get/all',JWT.validateAdminToken, controller.getAllUsers);
/** update */
router.patch('/patch/changePassword', controller.changePassword);
/** delete */
router.delete('/delete/deleteUser', controller.deleteUser);


router.use(handler);

export default { router };