import express from 'express';
import noteRouter from './notes';
import userRouter from './user';
import JWT from '../middleware/authJWT';
//import addSpanMiddleware from '../middleware/tracer';

const router = express.Router();

    //router.use('/', addSpanMiddleware)
    router.use('/users', userRouter.router);
    router.use('/notes', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, noteRouter.router);


    
export default { router };