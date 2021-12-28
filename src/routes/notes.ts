import express from 'express';
import controller from '../controllers/notes';
import handler from '../middleware/responseHandler';


const router = express.Router();



/** create */
router.post('/post/note', controller.createNote);
router.post('/post/createNotes', controller.createNotes);
/** read */
router.get('/Admin/get/allNotes' ,controller.getAllNotes);


router.get('/get/myNotes', controller.getMyNotes);
/** update */
router.put('/put/updateNote', controller.updateNote);
/** delete */
router.delete('/delete/deleteNote', controller.deleteNote);
router.delete('/delete/allUsersNotes' ,controller.deleteAllUsersNotes);

router.use(handler.ResultHandler);


export default { router };
