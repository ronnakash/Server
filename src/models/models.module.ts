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
    path: string;

    constructor(path : string){
        this.path = path;
    }


    configure(consumer: MiddlewareConsumer){
        // const fullPath = `/${this.path}*`;
        // const getRouteInfo : RouteInfo = {
        //     path: fullPath,
        //     method: RequestMethod.GET
        // };
        // const postRouteInfo : RouteInfo = {
        //     path: fullPath,
        //     method: RequestMethod.POST
        // };
        // const PutRouteInfo : RouteInfo = {
        //     path: fullPath,
        //     method: RequestMethod.PUT
        // };
        // const deleteRouteInfo : RouteInfo = {
        //     path: fullPath,
        //     method: RequestMethod.DELETE
        // };
        const routeInfo : RouteInfo = {
            path: `/${this.path}*`,
            method: RequestMethod.ALL
        };
        consumer.apply(ExistsJWTMiddleware, ValidateUserOrAdminMiddleware).forRoutes(routeInfo);

    };
}
