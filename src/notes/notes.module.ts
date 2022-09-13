import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import NoteModel from '../schemas/notes';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: "Note",
            schema: NoteModel
        }
    ])],
    controllers: [NotesController],
    providers: [NotesService]
})
export class NotesModule {}
