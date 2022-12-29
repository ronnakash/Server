import { Body, Controller, Get, Next, Put, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response} from 'express';
import { Model } from 'mongoose';
import { ModelsController } from '../models/models.controller';
import { INote, NoteDocument} from '../interfaces/notes';
import {NoteModel as Note} from '../schemas/notes';
// import Query from '../utils/query';
import { NotesService } from './notes.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import AppError from '../utils/AppError';


@Controller('notes')
export class NotesController extends ModelsController<NoteDocument>{

    constructor(//@InjectModel("Note") private noteModel : Model<NoteDocument>,
            private notesService : NotesService) {
        super(notesService)
    }

    @Put("")
    async createModel(@Body() reqBody : NoteDocument) {
        let newNote = await this.notesService.createModel(reqBody);
        return {
            message: `Created new note for ${newNote.author}`, 
            newNote
        }
    };

    // @Put()
    // async updateModel(@Body() reqBody : NoteDocument) {
    //     let doc = await this.notesService.updateModel(reqBody);
    //     return {
    //         message: `Updated model sucsessfully`,
    //         updated: doc
    //     }
    // }

    // @Put()
    // async createNotes(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
    //     let {notes} = req.body;
    //     let newNotes: NoteDocument[] = [];
    //     notes.forEach((note: INote) => {
    //         let { author, title, body, color } = note;
    //         newNotes.push(new Note({
    //             author,
    //             title, 
    //             body,
    //             color
    //         }));
    //     });
    //     const CreatedNotes = await this.notesService.createMany(newNotes);
    //     res.locals.result = {
    //         message: `Created ${CreatedNotes.length} new notes`,
    //         CreatedNotes
    //     }
    //     next();
    // }
    
}
