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

    updateModel(model: NoteDocument): Promise<NoteDocument> {
        throw new Error('Method not implemented.');
    }

}
