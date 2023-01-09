import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from '../notes/notes.repository';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';
import { ModelBase } from '../interfaces/models';
import { Document } from 'mongoose';


@Module({})
export abstract class ModelsModule<M extends ModelBase, S extends Document> implements NestModule{

    constructor(path : string){
    }


    abstract configure(consumer: MiddlewareConsumer) : void;
}
