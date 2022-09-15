import mongoose, { Document } from 'mongoose';
import {UserDocument} from './user';

export interface INote {
    title: string;
    author: string;
    body: string;
    color: string;
}


export interface NoteDto extends INote {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
}

export interface NoteBaseDocument extends NoteDto, Document {
    _id: mongoose.ObjectId;
    __v: number;
}

export interface NoteDocument extends NoteBaseDocument {
    getAuthor() : Promise<UserDocument>
}