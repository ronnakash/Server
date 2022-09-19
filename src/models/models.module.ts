import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from '../notes/notes.repository';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';

@Module({})
export abstract class ModelsModule implements NestModule{
    route : RouteInfo;

    constructor(){
        this.route = {
            path: "*",
            method: RequestMethod.ALL
        }
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(GetJWTMiddleware, ExistsJWTMiddleware, ValidateUserOrAdminMiddleware).forRoutes(this.route);
    }
}
