import express from 'express';
import controller from '../controllers/notes';
import JWT from '../middleware/authJWT';

const router = express.Router();

/** create */
router.post('/post/note', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, controller.createNote);
router.post('/post/createNotes', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, controller.createNotes);
/** read */
router.get('/get/allNotes', JWT.getJWT, JWT.existsJWT, JWT.validateAdminToken ,controller.getAllNotes);
router.get('/get/myNotes', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, controller.getMyNotes);
/** update */
router.put('/put/updateNote', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, controller.updateNote);
/** delete */
router.delete('/delete/deleteNote', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin, controller.deleteNote);
router.delete('/delete/allNotes', JWT.getJWT, JWT.existsJWT, JWT.validateAdminToken ,controller.deleteAllNotes);
router.delete('/delete/allUsersNotes', JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin ,controller.deleteAllUsersNotes);


export default { router };
