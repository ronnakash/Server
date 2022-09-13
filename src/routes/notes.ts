import express from 'express';
import controller from '../controllers/notes';
import handler from '../middleware/responseHandler';


const router = express.Router();



/** create */
router.post('/note', controller.createNote);
// router.post('/createNotes', controller.createNotes);
/** read */
router.get('/Admin/allNotes' ,controller.getAllNotes);
//router.get('/get/myNotes', controller.getMyNotesFromJWT);
router.get('/usersNotes', controller.getMyNotes);
/** update */
router.put('/updateNote', controller.updateNote);
/** delete */
router.delete('/deleteNote', controller.deleteNoteById);


router.use(handler);



export default { router };
