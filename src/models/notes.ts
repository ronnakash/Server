import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import INote from '../interfaces/notes';

const NoteSchema: Schema = new Schema(
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









const NoteModel = mongoose.model<INote>('Note', NoteSchema)

export default NoteModel;