import express from 'express';
import controller from '../controllers/notes';
import JWT from '../middleware/authJWT';

const router = express.Router();


//insert middleware
router
    .use(JWT.getJWT, JWT.existsJWT, JWT.validateUserOrAdmin)
    .use('/Admin', JWT.validateAdminToken)


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
router.delete('/delete/allNotes' ,controller.deleteAllNotes);
router.delete('/Admin/delete/allUsersNotes' ,controller.deleteAllUsersNotes);




export default { router };
