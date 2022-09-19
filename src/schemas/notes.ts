import mongoose, { Schema, Model, model, Document } from 'mongoose';
import {NoteDocument} from '../interfaces/notes';
import {UserDocument} from '../interfaces/user';

export const NoteSchema: Schema<NoteDocument> = new Schema<NoteDocument>(
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

export const NoteModel = model('Note', NoteSchema)


