import express from 'express';
import controller from '../controllers/hello';

const router = express.Router();

router.get('/hello', controller.sayHello);


export default {router};
