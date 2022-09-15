import { Injectable } from '@nestjs/common';
import { NoteDocument } from '../interfaces/notes';
import { ModelsService } from '../models/models.service';
import { NoteModel } from '../schemas/notes';
import { NotesRepository } from './notes.repository';

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

}
