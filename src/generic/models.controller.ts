import { Body, Controller, Delete, Get, Next, Param, Post, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import { NoteDto } from '../interfaces/notes';
import mongoose, { Model } from 'mongoose';
import Query from '../utils/query';
import logging from '../config/logging';
import urlParser from '../utils/urlParser';



export abstract class ModelsController<T extends mongoose.Document> {
    model: Model<T>;

    protected constructor(model: Model<T>){
        this.model = model;
    }

    @Get()
    async getAll(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let params = urlParser(req.url);
        let docs = await Query
            .getMany(this.model, {find: params})
            .catch( error => next(error));
        res.locals.result = {
            message: docs ? `Got ${docs.length} results` : `Got no results`,
            docs
        };
        next();
    }


    @Get('/:id')
    async getById(@Param('id') id : string, @Res() res : Response, @Next() next: NextFunction) {
        let doc = await Query
            .getOneById(this.model, id)
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
        const models = await Query
            .getMany(this.model, params)
            .catch( error => next(error));
        res.locals.result = {
            message: models ? `Got ${models.length} results` : `Got no results`,
            models
        };
        next();
    }


    @Get('/my')
    async getMyModelsFromJWT(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        const models = await Query
            .getMany(this.model, {find: {uid: res.locals.token.uid}})
            .catch(error => next(error));
        res.locals.result = {
            message: models ? `Got ${models.length} results` : `Got no results`,
            models
        };
        next();
    }


    @Put()
    async updateModel(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { id, body, title, color } = req.body;
        const updated = await Query.updateOneById(this.model,{
            _id: id, 
            toUpdate: {body, title, color}
        }).catch( error => next(error));
        res.locals.result = {
            message: `Updated model sucsessfully`,
            updated
        }
        next();
    }

    
    
    @Delete()
    async deleteModelById(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { _id } = req.body;
        let deleted = await Query
            .deleteOneById(this.model, _id)
            .catch( error => next(error));
        res.locals.result = {
            message: deleted? `Deleted model sucsessfuly` : `model not found`,
            model: deleted,
            statusCode: deleted? 200 : 400
        };
        next();
        }

}
