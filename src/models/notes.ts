import mongoose, { Schema, Model, Document } from 'mongoose';
import logging from '../config/logging';
import INote from '../interfaces/notes';
import UserDocument from '../interfaces/user';

const NoteSchema: Schema = new Schema<NoteDocument>(
    {
        title: { 
            type: String, 
            required: true
        },

        author: { 
            type: String, 
            required: true 
        },

        body: { 
            type: String, 
            required: false 
        }
    },
    
    {
        timestamps: true
    }
);

interface NoteBaseDocument extends INote, Document {
}

export interface NoteDocument extends NoteBaseDocument {
    getAuthor() : Promise<UserDocument>
}

const NoteModel = mongoose.model<NoteDocument, Model<NoteDocument>>('Note', NoteSchema)

export default NoteModel;