import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Note from '../models/notes';
import notes from '../interfaces/notes';
import AppError from '../utils/appError';
import Query from '../utils/query';
import logging from '../config/logging';
import modelsController from '../controllers/models';


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
    modelsController.getAllModels(Note,req,res, next);
};

const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getModelById(Note,req,res, next);
}; 


/**  getMyNotes
 * 
 * get all notes that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyNotes = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.getMyModels(Note,req,res, next);
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
    modelsController.updateModel(Note,req,res, next);
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
    modelsController.deleteModelById(Note,req,res, next);
};


/** deleteAllUsersNotes 
 * 
 * delete all notes of a selected user
 * request must contain username for which notes to delete
 * token must be admin or belong to the user who's notes will be deleted 
 * 
*/

const deleteAllUsersNotes = async (req: Request, res: Response, next: NextFunction) => {
    modelsController.deleteAllUsersModels(Note,req,res, next);
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
    let { _id, author, title, body} = req.body;
    const note = new Note({
        _id: _id? _id : new mongoose.Types.ObjectId(),
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
    notes.forEach((note: { _id: any; author: string; title: string; body: string; }) => {
        let { _id, author, title, body } = note;
        newNotes.push(new Note({
            _id: _id? _id : new mongoose.Types.ObjectId(),
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