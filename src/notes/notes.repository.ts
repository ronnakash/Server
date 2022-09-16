import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { NoteDocument } from '../interfaces/notes';
import { QueryFeaturesParams, UpdateByIdQueryParams, UpdateQueryParams } from '../interfaces/queries';
import { UserDocument } from '../interfaces/user';
import { ModelsRepository } from '../models/models.repository';
import { NoteModel } from '../schemas/notes';
import AppError from '../utils/appError';
import QueryFeatures from '../utils/queryFeatures';

@Injectable()
export class NotesRepository extends ModelsRepository<NoteDocument> {

    constructor(@InjectModel("Note") private noteModel: Model<NoteDocument>
    ) {
        super(noteModel);
    }

}