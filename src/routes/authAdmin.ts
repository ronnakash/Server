import express from 'express';
import noteRouter from './notes';
import userRouter from './user';
// import JWT from '../middleware/authJWT';

const router = express.Router();

// router
//     .use(JWT.getJWT, JWT.existsJWT, JWT.validateAdminToken);

    router.use('/users', userRouter.router);
    router.use('/notes', noteRouter.router);


    
export default { router };