import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from './notes.repository';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: "Note",
            schema: NoteSchema
        }
    ])],
    controllers: [NotesController],
    providers: [NotesService, NotesRepository],
    // exports: [NotesController]
})
export class NotesModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        const nri1 : RouteInfo = {
            path: "auth/.*",
            method: RequestMethod.ALL
        };
        consumer.apply(GetJWTMiddleware, ExistsJWTMiddleware, ValidateUserOrAdminMiddleware).forRoutes(nri1);
    }
}

