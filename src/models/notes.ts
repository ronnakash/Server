import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import INote from '../interfaces/notes';

const NoteSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        body: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

NoteSchema.post<INote>('save', function () {
    logging.info('Mongo', 'You created a new note: ', this);
});

export default mongoose.model<INote>('Note', NoteSchema);