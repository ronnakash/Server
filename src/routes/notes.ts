import express from 'express';
import controller from '../controllers/notes';
import JWT from '../middleware/authJWT';

const router = express.Router();

/** create */
router.get('/post/note', JWT.getJWT, JWT.validateUserOrAdmin, controller.createNote);
/** read */
router.get('/get/allNotes', JWT.getJWT, JWT.validateAdminToken ,controller.getAllNotes);
router.get('/get/myNotes', JWT.getJWT, JWT.validateUserOrAdmin, controller.getMyNotes);
/** update */
router.get('/put/updateNote', JWT.getJWT, JWT.validateUserOrAdmin, controller.updateNote);
/** delete */
router.get('/delete/deleteNote', JWT.getJWT, JWT.validateUserOrAdmin, controller.deleteNote);



export default { router };
