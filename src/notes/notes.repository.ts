import { Injectable } from '@nestjs/common';
import mongoose, { Document, Model } from 'mongoose';
import { NoteDocument } from '../interfaces/notes';
import { QueryFeaturesParams, UpdateByIdQueryParams, UpdateQueryParams } from '../interfaces/queries';
import { UserDocument } from '../interfaces/user';
import { ModelsRepository } from '../models/models.repository';
import AppError from '../utils/appError';
import QueryFeatures from '../utils/queryFeatures';

@Injectable()
export class NotesRepository extends ModelsRepository<NoteDocument> {


}