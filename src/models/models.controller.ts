import { Body, Controller, Delete, Get, Next, Param, Post, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import { NoteDto } from '../interfaces/notes';
import mongoose, { Model } from 'mongoose';
import urlParser from '../utils/urlParser';
import { ModelsService } from './models.service';

@Controller()
export abstract class ModelsController<T extends mongoose.Document> {
    service : ModelsService<T>;

    protected constructor(modelsService : ModelsService<T>){
        this.service = modelsService;
    }

    @Get()
    async getAll(@Req() req : Request) {
        let params = urlParser(req.url);
        let docs = await this.service
            .getAll({find: params})
        return {
            message: docs ? `Got ${docs.length} results` : `Got no results`,
            docs
        };
    }


    @Get('/id/:id')
    async getById(@Param('id') id : string) {
        let doc = await this.service
            .getById(id);
        return {
            message: `Got doc sucsessfuly`,
            doc
        };
    }


    @Get('/my')
    async getMyModels(@Req() req : Request) {
        let params = urlParser(req.url);
        const models = await this.service
            .getMany(params)
        return {
            message: models ? `Got ${models.length} results` : `Got no results`,
            models
        };
    }


    // @Get('/my')
    // async getMyModelsFromJWT(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
    //     const models = await this.service
    //         .getMany({find: {uid: res.locals.token.uid}})
    //         .catch(error => next(error));
    //     res.locals.result = {
    //         message: models ? `Got ${models.length} results` : `Got no results`,
    //         models
    //     };
    //     next();
    // }

    
    @Post()
    async updateModel(@Body() reqBody : T) {
        let doc = await this.service.updateModel(reqBody);
        return {
            message: `Updated model sucsessfully`,
            updated: doc
        }
    }
    
    
    @Delete()
    async deleteModelById(@Body() body: T) {
        let { _id } = body;
        let deleted = await this.service.deleteModelById(_id);
        return {
            message: deleted? `Deleted model sucsessfuly` : `model not found`,
            model: deleted,
            statusCode: deleted? 200 : 400
        };
    }

    // @Put()


}
