import express from 'express';
import controller from '../controllers/notes';
import handler from '../middleware/responseHandler';


const router = express.Router();



/** create */
router.post('/post/note', controller.createNote);
router.post('/post/createNotes', controller.createNotes);
/** read */
router.get('/Admin/get/allNotes' ,controller.getAllNotes);
router.get('/get/myNotes', controller.getMyNotesFromJWT);
router.get('/get/usersNotes', controller.getMyNotes);
/** update */
router.put('/put/updateNote', controller.updateNote);
/** delete */
router.delete('/delete/deleteNote', controller.deleteNoteById);


router.use(handler);



export default { router };
