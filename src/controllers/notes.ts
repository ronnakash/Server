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
    let docs = await Query.getMany(Note, req.body);
        res.locals.result = docs;
    next();
};

/**  QueryNotes
 * 
 * get all notes from mongoose using custom query
 * requires token from administrator user
 * 
*/

const QueryNotes = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.result = await Query.getMany(Note, req.body);
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
    let { select, sort } = req.body;
    let params = {
        find: {author: username},
        select: select,
        sort: sort
    };
    res.locals.result = await Query.getMany(Note, params);
    next();
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

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    let { _id, body, title } = req.body;
    res.locals.result = await Query.updateOneById(Note,{
        _id: _id, 
        toUpdate: {body, title}
    });
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
    let deleted = await Query.deleteOneById(Note, _id).catch( error => next(error));
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
    if (author)
        res.locals.result = await Query.deleteMany(Note, {find: {author: author}});
    else 
        res.locals.result = new AppError("no author provided for deleteAllUsersNotes!", 400);
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
    res.locals.result = await Query.createOne(Note, note);
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
    res.locals.result = await Query.createMany(Note, newNotes);
    next();
};


export default { createNote, getAllNotes, updateNote, getMyNotes, deleteNoteById, deleteAllUsersNotes, createNotes, QueryNotes};