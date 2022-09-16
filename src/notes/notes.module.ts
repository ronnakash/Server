import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from './notes.repository';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: "Note",
            schema: NoteSchema
        }
    ])],
    controllers: [NotesController],
    providers: [NotesService, NotesRepository]
})
export class NotesModule {}
