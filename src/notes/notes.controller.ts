import { Body, Controller, Get, Next, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import { ModelsController } from '../generic/models.controller';
import NoteDocument, { INote, NoteDto } from '../interfaces/notes';
import Note from '../models/notes';
import Query from '../utils/query';


@Controller('notes')
export class NotesController extends ModelsController<NoteDocument>{

    constructor() {
        super(Note)
    }

    @Put()
    async updateModel(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { id, body, title, color } = req.body;
        let doc = await Query
            .getOneById(Note, id)
            .catch( error => next(error));
        if (doc) {
            doc.body = body;
            doc.title = title;
            doc.color = color;
            await doc.save();
            res.locals.result = {
                message: `Updated model sucsessfully`,
                updated: doc
            }
            next();
        }
    }

    @Put()
    async createNotes(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let {notes} = req.body;
        let newNotes: NoteDocument[] = [];
        notes.forEach((note: INote) => {
            let { author, title, body, color } = note;
            newNotes.push(new Note({
                author,
                title, 
                body,
                color
            }));
        });
        const CreatedNotes = await Query.createMany(Note, newNotes);
        res.locals.result = {
            message: `Created ${CreatedNotes.length} new notes`,
            CreatedNotes
        }
        next();
    }

}
