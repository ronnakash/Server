import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import mongoose from 'mongoose';
import Note from '../models/notes';

const NAMESPACE = 'Notes Controller';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** read */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  getAllNotes
 * 
 * get all notes from mongoose
 * requires token from administrator user
 * 
*/

const getAllNotes = (req: Request, res: Response, next: NextFunction) => {
    Note.find({})
        .select('author title body createdAt')
        .exec()
        .then((notes) => {
            logging.info(NAMESPACE, `Got ${notes.length} notes from mongoose`);
            return res.status(200).json({
                notes: notes,
                count: notes.length
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


/**  getMyNotes
 * 
 * get all notes that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyNotes = (req: Request, res: Response, next: NextFunction) => {
    let author = res.locals.jwt.username;
  
    Note.find({ author: author })
        .select('title author body createdAt')
        .exec()
        .then((notes) => {
            logging.info(NAMESPACE, `Got ${notes.length} notes from mongoose`);
            return res.status(200).json({
            author: author,
            notes: notes,
            count: notes.length
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


/** getNoteById */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** update */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  updateNote
 * 
 * edits note by id
 * user must be author of the note and have a valid token connected to username
 * req.body must contain id, author, body and title
 * 
 * res.body contains the original note before edits
*/

const updateNote = (req: Request, res: Response, next: NextFunction) => {
    let { id, author, body, title } = req.body;
    Note.findOneAndUpdate({id, author}, {body, title})
        .exec()
        .then((note) => {
            logging.info(NAMESPACE, 'Updated note');
            return res.status(200).json({
                messege: "Updated note",
                originalNote: note
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  deleteNote
 * 
 * delete note by id
 * user must be author of the note or have administrator permissions
 * req.body must contain note id and author for note to delete
 * 
*/

const deleteNote = (req: Request, res: Response, next: NextFunction) => {
    let { id, author } = req.body;
    Note.findOneAndRemove({id, author})
        .exec()
        .then((note) => {
            logging.info(NAMESPACE, 'Deleted note', note);
            return res.status(200).json({
                messege: "Deleted note",
                deletedNote: note
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


/** deleteAllNotes 
 * 
 * deletes all notes in database
 * requires admin permissions 
 * be very cautious when using! all notes for all users will be deleted
 * 
 * 
*/

const deleteAllNotes = (req: Request, res: Response, next: NextFunction) => {
    Note.deleteMany({})
        .exec()
        .then((notes) => {
            return res.status(200).json({

                message: `Deleted ${notes.deletedCount} notes`,
                notes: notes,
                count: notes.deletedCount
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};



/** deleteAllUsersNotes 
 * 
 * delete all notes of a selected user
 * request must contain username for which notes to delete
 * token must be admin or belong to the user who's notes will be deleted 
 * 
*/

const deleteAllUsersNotes = (req: Request, res: Response, next: NextFunction) => {
    let { user } = req.body;
    Note.deleteMany({author: user})
    .select('-username')
    .exec()
    .then((notes) => {
        return res.status(200).json({

            message: `Deleted ${notes.deletedCount} notes for user ${user}`,
            user: user,
            notes: notes,
            count: notes.deletedCount
        });
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(500).json({
            message: error.message,
            error
        });
    });


}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** create */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**  createNote
 * 
 * saves new note to database
 * user must be author of the note and have a valid token connected to username
 * admins can also create notes for other users
 * req.body must contain author, body and title
 * 
*/

const createNote = (req: Request, res: Response, next: NextFunction) => {
    let { author, title, body} = req.body;
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        author,
        title, 
        body
    });
    return note.save()
        .then((result) => {
            logging.info(NAMESPACE, 'Created note', note);
            return res.status(201).json({
                note: result
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};




export default { createNote, getAllNotes, updateNote, getMyNotes, deleteNote, deleteAllNotes, deleteAllUsersNotes};