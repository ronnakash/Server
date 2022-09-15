import { Injectable } from '@nestjs/common';
import { NoteDocument } from '../interfaces/notes';
import { ModelsService } from '../models/models.service';
import { NoteModel } from '../schemas/notes';

@Injectable()
export class NotesService extends ModelsService<NoteDocument>{

    constructor(){
        super();
        super.model = NoteModel;
    }

}
