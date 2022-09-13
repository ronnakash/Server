import { Body, Controller, Delete, Get, Next, Param, Post, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import { NoteDto } from '../interfaces/notes';
import mongoose, { Model } from 'mongoose';
import logging from '../config/logging';
import urlParser from '../utils/urlParser';
import { ModelsService } from './models.service';

@Controller()
export abstract class ModelsController<T extends mongoose.Document> {
    service : ModelsService<T>;

    protected constructor(modelsService : ModelsService<T>){
        this.service = modelsService;
    }

    @Get()
    async getAll(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let params = urlParser(req.url);
        let docs = await this.service
            .getMany({find: params})
            .catch( error => next(error));
        res.locals.result = {
            message: docs ? `Got ${docs.length} results` : `Got no results`,
            docs
        };
        next();
    }


    @Get('/:id')
    async getById(@Param('id') id : string, @Res() res : Response, @Next() next: NextFunction) {
        let doc = await this.service
            .getOneById(id)
            .catch( error => next(error));
        res.locals.result = {
            message: `Got doc sucsessfuly`,
            doc
        };
        next();
    }


    @Get('/my')
    async getMyModels(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let params = urlParser(req.url);
        const models = await this.service
            .getMany(params)
            .catch( error => next(error));
        res.locals.result = {
            message: models ? `Got ${models.length} results` : `Got no results`,
            models
        };
        next();
    }


    @Get('/my')
    async getMyModelsFromJWT(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        const models = await this.service
            .getMany({find: {uid: res.locals.token.uid}})
            .catch(error => next(error));
        res.locals.result = {
            message: models ? `Got ${models.length} results` : `Got no results`,
            models
        };
        next();
    }


    abstract updateModel(req : Request, res : Response, next: NextFunction) : Promise<void>;
    
    
    @Delete()
    async deleteModelById(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { _id } = req.body;
        let deleted = await this.service
            .deleteOneById(_id)
            .catch( error => next(error));
        res.locals.result = {
            message: deleted? `Deleted model sucsessfuly` : `model not found`,
            model: deleted,
            statusCode: deleted? 200 : 400
        };
        next();
        }

}
