import express from 'express';
import controller from '../controllers/notes';
import JWT from '../middleware/extractJWT';

const router = express.Router();

/** create */
router.get('/post/note', JWT.extractJWT, controller.createNote);
/** read */
router.get('/get/allNotes', JWT.extractJWT ,controller.getAllNotes);
router.get('/get/myNotes', JWT.getJWT, JWT.validateAdminToken, controller.getMyNotes);
/** update */
router.get('/put/updateNote', JWT.extractJWT, controller.updateNote);
/** delete */
router.get('/delete/deleteNote', JWT.extractJWT, controller.deleteNote);



export default { router };
