import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import mongoose from 'mongoose';
import Note from '../models/notes';
import User from '../models/user';



const NAMESPACE = 'Notes Controller';

/** create */

/**  getAllNotes
 * 
 * saves new note to database
 * user must be author of the note and have a valid token connected to username
 * req.body must contain author, body and title
 * 
*/

const createNote = (req: Request, res: Response, next: NextFunction) => {
    let { author, title, body} = req.body;
    let tokenAuthor = res.locals.jwt.username;
    
    if (!tokenAuthor){
        return res.status(404).json({
            message: "Cannot retreive user from token"
        });
    } else if (author != tokenAuthor){
        return res.status(201).json({
            message: "Token does not match author"
        });
    }

    if (body){
        const note = new Note({
            _id: new mongoose.Types.ObjectId(),
            author,
            title, 
            body
        });
        return note
        .save()
        .then((result) => {
            return res.status(201).json({
                note: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    }
    else {
        const note = new Note({
            _id: new mongoose.Types.ObjectId(),
            author,
            title
        });
        return note
        .save()
        .then((result) => {
            return res.status(201).json({
                note: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    }

};


/** read */

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
            return res.status(200).json({
                notes: notes,
                count: notes.length
            });
        })
        .catch((error) => {
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
        .select('title body createdAt')
        .exec()
        .then((notes) => {
            return res.status(200).json({
            author: author,
            notes: notes,
            count: notes.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


/** update */

/**  getAllNotes
 * 
 * edits note by id
 * user must be author of the note and have a valid token connected to username
 * req.body must contain id, author, body and title
 * 
 * res.body contains the original note before edits
*/

const updateNote = (req: Request, res: Response, next: NextFunction) => {
    let { id, author, body, title } = req.body;
    //validate author matches token


    Note.findOneAndUpdate({id, author}, {body, title})
        .exec()
        .then((note) => {
            return res.status(200).json({
                note: note
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    
};



export default { createNote, getAllNotes, updateNote, getMyNotes };