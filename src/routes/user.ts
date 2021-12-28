import express from 'express';
import controller from '../controllers/user';
import JWT from '../middleware/authJWT';
import handler from '../middleware/responseHandler';


const router = express.Router();


//insert middleware
/*
router
    .use(JWT.getJWT, JWT.existsJWT)
    .post('/post/', JWT.adminIfNeeded)
    .patch('/', JWT.validateUserOrAdmin)
    .delete('/', JWT.validateUserOrAdmin)
    .use('/Admin', JWT.validateAdminToken);
*/

/** create */
router.post('/post/register', controller.register, controller.returnLocals);
router.post('/post/registerAndLogin', controller.register, controller.safeLogin, controller.returnLocals);
/** read */
router.get('/get/validate', controller.validateToken);
router.post('/login', controller.login, handler.ResultHandler);
router.get('/Admin/get/all', controller.getAllUsers);
/** update */
router.patch('/patch/changePassword', controller.changePassword);
/** delete */
router.delete('/delete/deleteUser', controller.deleteUser);


export default { router };