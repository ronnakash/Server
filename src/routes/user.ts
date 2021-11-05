import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/get/validate', extractJWT, controller.validateToken);
router.get('/post/register', controller.register);
router.get('/post/login', controller.login);
router.get('/get/all', extractJWT, controller.getAllUsers);


export default { router };