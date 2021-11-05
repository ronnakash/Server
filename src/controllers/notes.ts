import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import mongoose from 'mongoose';
import Note from '../models/notes';
import User from '../models/user';



const NAMESPACE = 'Notes Controller';

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



const createNote = (req: Request, res: Response, next: NextFunction) => {
    let { title, body} = req.body;
    let author = res.locals.jwt.username;
    
    if (!author){
        return res.status(404).json({
            message: "Cannot retreive user from token"
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

export default { createNote, getAllNotes, getMyNotes };