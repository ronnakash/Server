import express from 'express';
import controller from '../controllers/notes';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/get/allNotes', extractJWT ,controller.getAllNotes);
router.get('/post/note', extractJWT, controller.createNote);
router.get('/get/myNotes', extractJWT, controller.getMyNotes);


export default { router };
