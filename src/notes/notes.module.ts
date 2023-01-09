import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteDocument } from '../interfaces/notes';
import {NoteSchema} from '../schemas/notes';
import { NotesRepository } from './notes.repository';
import { RouteInfo } from '@nestjs/common/interfaces';
// import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';
import { ModelsModule } from '../models/models.module';
import { ExistsJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';

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
export class NotesModule extends ModelsModule<Note, NoteDocument>{
    configure(consumer: MiddlewareConsumer): void {
        // const fullPath = `/${this.path}*`;
        // super.configure(consumer);
        // const allRouteInfo : RouteInfo = {
        //     path: `/${this.path}*`,
        //     method: RequestMethod.ALL
        // };
        const postRouteInfo : RouteInfo = {
            path: this.path,
            method: RequestMethod.POST
        };
        const PutRouteInfo : RouteInfo = {
            path: this.path,
            method: RequestMethod.PUT
        };
        const deleteRouteInfo : RouteInfo = {
            path: this.path,
            method: RequestMethod.DELETE
        };
        consumer.apply(ExistsJWTMiddleware, ValidateUserOrAdminMiddleware)
            .forRoutes(postRouteInfo, PutRouteInfo, deleteRouteInfo);
    }

    constructor(){
        super("note");
    }
    

}

