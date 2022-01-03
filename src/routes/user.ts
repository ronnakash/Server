import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';
import handler from '../middleware/responseHandler';


const router = express.Router();


/** create */
router.post('/register', controller.register);
router.post('/registerAndLogin', controller.register, controller.safeLogin);
router.post('/login', controller.login);
/** read */
router.get('/get/all',JWT.validateAdminToken, controller.getAllUsers);
/** update */
router.patch('/changePassword', controller.changePassword);
/** delete */
router.delete('/deleteUser', controller.deleteUser);


router.use(handler);

export default { router };