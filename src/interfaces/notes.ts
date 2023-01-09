import mongoose, { Document } from 'mongoose';
import {UserDocument} from './user';
import { ModelBase } from './models';

export interface Note extends ModelBase {
    title: string;
    author: string;
    body: string;
    color: string;
}


export interface NoteDto extends Note {
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