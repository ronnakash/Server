import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from '../notes/notes.repository';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';

@Module({})
export abstract class ModelsModule implements NestModule{

    constructor(path : string){
    }

    configure(consumer: MiddlewareConsumer) {
    }
}
