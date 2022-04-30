import { NextFunction, Request, Response } from 'express';
import Note from '../models/notes';
import AppError from '../utils/appError';
import Query from '../utils/query';
import logging from '../config/logging';
import modelsController from '../controllers/models';
import NoteDocument, { INote } from '../interfaces/notes';


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

const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getAllModels(Note, req, res, next);
};

const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getModelById(Note, req, res, next);
}; 


/**  getMyNotes
 * 
 * get all notes that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyNotes = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getMyModels(Note, req, res, next);
};

const getMyNotesFromJWT = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getMyModelsFromJWT(Note, req, res, next);
};


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

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    //modelsController.updateModel(Note, req, res, next);
    let { id, body, title, color } = req.body;
    logging.debug(NAMESPACE, "body:", req.body)
    let doc = await Query
        .getOneById(Note, id)
        .catch( error => next(error));
    if (doc) {
        logging.debug(NAMESPACE, "doc: ", doc)
        doc.body = body;
        doc.title = title;
        doc.color = color;
        await doc.save();
        res.locals.result = {
            message: `Updated model sucsessfully`,
            updated: doc
        }
        next();
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  deleteNoteById
 * 
 * delete note by id
 * user must be author of the note or have administrator permissions
 * req.body must contain note id and author for note to delete
 * 
*/

const deleteNoteById = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.deleteModelById(Note, req, res, next);
};



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

const createNote = async (req: Request, res: Response, next: NextFunction) => {
    let { author, title, body, color} = req.body;
    if (!author || (!title && !body))
        next(new AppError(`not all required args were provided`,400));
    else {
        const note = new Note({
            author,
            title, 
            body,
            color
        })
        const newNote = await Query.createOne(Note, note);
        res.locals.result = {
            message: `Created new note for ${author}`, 
            newNote
        }
        next();
    }

};


/** createNotes 
 * 
 * saves new notes to database
 * user must be author of the note and have a valid token connected to username
 * admins can also create notes for other users
 * req.body must contain list of notes to create
 * each containing author, body and title
 * 
*/

const createNotes = async (req: Request, res: Response, next: NextFunction) => {
    let {notes} = req.body;
    let newNotes: NoteDocument[] = [];
    notes.forEach((note: INote) => {
        let { author, title, body, color } = note;
        newNotes.push(new Note({
            author,
            title, 
            body,
            color
        }));
    });
    const CreatedNotes = await Query.createMany(Note, newNotes);
    res.locals.result = {
        message: `Created ${CreatedNotes.length} new notes`,
        CreatedNotes
    }
    next();
};


export default { getNoteById, createNote, getAllNotes, updateNote, getMyNotes, getMyNotesFromJWT, deleteNoteById, createNotes};