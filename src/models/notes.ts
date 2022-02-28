import mongoose, { Schema, Model } from 'mongoose';
import logging from '../config/logging';
import INote from '../interfaces/notes';

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

export interface NoteDocument extends INote {
    
}


const NoteModel = mongoose.model<NoteDocument, Model<NoteDocument>>('Note', NoteSchema)

export default NoteModel;