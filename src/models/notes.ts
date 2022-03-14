import mongoose, { Schema, Model, Document } from 'mongoose';
import logging from '../config/logging';
import NoteDocument, {INote} from '../interfaces/notes';
import UserDocument from '../interfaces/user';

const NoteSchema: Schema = new Schema<NoteDocument>(
    {
        title: { 
            type: String, 
            required: false,
            default: ''
        },

        author: { 
            type: String, 
            required: true 
        },

        body: { 
            type: String, 
            required: false,
            default: ''
        }
    },
    
    {
        timestamps: true
    }
);



const NoteModel = mongoose.model<NoteDocument, Model<NoteDocument>>('Note', NoteSchema)

export default NoteModel;