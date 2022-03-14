import mongoose, { Document } from 'mongoose';
import UserDocument from './user';

export interface INote {
    title: string;
    author: string;
    body: string;
    color: string;
}

interface NoteBaseDocument extends INote, Document {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
    __v: number;
}

export default interface NoteDocument extends NoteBaseDocument {
    getAuthor() : Promise<UserDocument>
}