import { Body, Controller, Get, Next, Put, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response} from 'express';
import { Model } from 'mongoose';
import { ModelsController } from '../models/models.controller';
import { INote, NoteDocument} from '../interfaces/notes';
import Note from '../models/notes';
// import Query from '../utils/query';
import { NotesService } from './notes.service';


@Controller('notes')
export class NotesController extends ModelsController<NoteDocument>{

    constructor( //@InjectModel("Note") private noteModel : Model<NoteDocument>,
            private notesService : NotesService) {
        super(notesService)
    }

    @Put()
    async updateModel(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { id, body, title, color } = req.body;
        let doc = await this.notesService
            .getOneById(id)
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
        const CreatedNotes = await this.notesService.createMany(newNotes);
        res.locals.result = {
            message: `Created ${CreatedNotes.length} new notes`,
            CreatedNotes
        }
        next();
    }

}
