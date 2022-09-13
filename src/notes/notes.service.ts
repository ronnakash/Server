import { Injectable } from '@nestjs/common';
import { NoteDocument } from '../interfaces/notes';
import { ModelsService } from '../models/models.service';

@Injectable()
export class NotesService extends ModelsService<NoteDocument>{}
