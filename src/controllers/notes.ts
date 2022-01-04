import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Note from '../models/notes';
import notes from '../interfaces/notes';
import AppError from '../utils/appError';
import Query from '../utils/query';
import logging from '../config/logging';

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
    let docs = await Query
        .getMany(Note, req.body)
        .catch( error => next(error));
    res.locals.result = {
        message: docs ? `Got ${docs.length} results` : `Got no results`,
        docs
    };
    next();
};

const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    let { _id } = req.body;
    let note = await Query
        .getOneById(Note, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: `Got note sucsessfuly`,
        note
    };
    next();
}; 



/**  getMyNotes
 * 
 * get all notes that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyNotes = async (req: Request, res: Response, next: NextFunction) => {
    let username = res.locals.jwt.username;
    let { find, select, sort } = req.body;
    find.author = username;
    let params = {find, select, sort};
    const notes = await Query
        .getMany(Note, params)
        .catch( error => next(error));
    res.locals.result = {
        message: notes ? `Got ${notes.length} results` : `Got no results`,
        notes
    };
    next();
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
    let { _id, body, title } = req.body;
    logging.info(NAMESPACE,"id:" , _id);
    const updated = await Query.updateOneById(Note,{
        _id: _id, 
        toUpdate: {body, title}
    }).catch( error => next(error));
    res.locals.result = {
        message: `Updated note sucsessfully`,
        updated
    }
    next();

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
    let { _id } = req.body;
    let deleted = await Query
        .deleteOneById(Note, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: deleted? `Deleted note sucsessfuly` : `Note not found`,
        note: deleted,
        statusCode: deleted? 200 : 400
    };
    next();
};


/** deleteAllUsersNotes 
 * 
 * delete all notes of a selected user
 * request must contain username for which notes to delete
 * token must be admin or belong to the user who's notes will be deleted 
 * 
*/

const deleteAllUsersNotes = async (req: Request, res: Response, next: NextFunction) => {
    let { author } = req.body;
    let { username, permissions } = res.locals.jwt
    author = author ? author : username;
    if (author !== username && permissions !== "Admin")
        next(new AppError("You don't have permissions to delete other users notes!", 400));
    const deleted = await Query.deleteMany(Note, {find: {author: author}});
    res.locals.result = {
        message: `Deleted notes sucsessfuly`,
        note: deleted
    };
    next();
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

const createNote = async (req: Request, res: Response, next: NextFunction) => {
    let { author, title, body} = req.body;
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        author,
        title, 
        body
    });
    const newNote = await Query.createOne(Note, note);
    res.locals.result = {
        message: `Created new note for ${author}`, 
        newNote
    }
    next();
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
    let newNotes: (notes & { _id: any })[] = [];
    notes.forEach((note: { author: string; title: string; body: string; }) => {
        let { author, title, body } = note;
        newNotes.push(new Note({
            author,
            title,
            body
        }));
    });
    const CreatedNotes = await Query.createMany(Note, newNotes);
    res.locals.result = {
        message: `Created ${CreatedNotes.length} new notes`,
        CreatedNotes
    }
    next();
};


export default { getNoteById, createNote, getAllNotes, updateNote, getMyNotes, deleteNoteById, deleteAllUsersNotes, createNotes};