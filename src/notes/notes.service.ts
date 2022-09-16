import { Injectable } from '@nestjs/common';
import { NoteDocument } from '../interfaces/notes';
import { ModelsService } from '../models/models.service';
import { NoteModel } from '../schemas/notes';
import AppError from '../utils/appError';
import { NotesRepository } from './notes.repository';
import {NoteModel as Note} from '../schemas/notes';


@Injectable()
export class NotesService extends ModelsService<NoteDocument>{


    constructor(private notesRepository : NotesRepository){
        super();
        super.repository = notesRepository;
    }

    async updateModel(doc: NoteDocument): Promise<NoteDocument> {
        let { id, body, title, color } = doc;
        let note = await this.notesRepository
            .getOneById(id);
        note.body = body;
        note.title = title;
        note.color = color;
        await note.save();
        return note;
    }

    async createModel(reqBody : NoteDocument)  {
        let { author, title, body, color} = reqBody;
        if (!author || (!title && !body))
            throw new AppError(`not all required args were provided`,400);
        const note = new Note({
            author,
            title, 
            body,
            color
        })
        return await this.notesRepository.createOne(note);
    };

}
