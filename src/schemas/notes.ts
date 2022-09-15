import mongoose, { Schema, Model, model, Document } from 'mongoose';
import logging from '../config/logging';
import {NoteDocument} from '../interfaces/notes';
import UserDocument from '../interfaces/user';

const NoteSchema: Schema<NoteDocument> = new Schema<NoteDocument>(
    // {
    //     title: {
    //         type: String, 
    //         required: false,
    //         default: ''
    //     },

    //     author: { 
    //         type: String, 
    //         required: true 
    //     },

    //     body: { 
    //         type: String, 
    //         required: false,
    //         default: ''
    //     },
    //     color: { 
    //         type: String, 
    //         required: false,
    //         default: '#fcf483'
    //     }
    // },
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
        },
        color: { 
            type: String, 
            required: false,
            default: '#fcf483'
        }
    },
    {
        timestamps: true
    }
);



// const NoteModel = mongoose.model<NoteDocument, Model<NoteDocument>>('Note', NoteSchema)

const NoteModel = model('Note', NoteSchema)


export default {NoteModel, NoteSchema};