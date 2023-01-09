import { Body, Controller, Delete, Get, Next, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import mongoose, { Document } from 'mongoose';
import { ModelsService } from './models.service';
import { JWTBody } from '../interfaces/middleware';

@Controller()
export abstract class ModelsController<T extends Document> {
    service : ModelsService<T>;

    protected constructor(modelsService : ModelsService<T>){
        this.service = modelsService;
    }

    @Get()
    async getAll(@Query() params : any) {
        // let params = urlParser(req.url);
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


    // @Get('/my')
    // async getMyModels(@Body() body : JWTBody) {
    //     // let params = urlParser(req.url);
    //     let {email} = body.jwt;
    //     const models = await this.service
    //         .getMany({find: {author: email}})
    //     return {
    //         message: models ? `Got ${models.length} results` : `Got no results`,
    //         models
    //     };
    // }

    abstract getMyModels(body : JWTBody) : Promise<{ message: string; models: T[]; }>;



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

    @Put()
    async createModel(@Body() reqBody : T) : Promise<{message: string, model: T }>{
        let newModel = await this.service.createModel(reqBody);
        return {
            message: `Created new model`, 
            model: newModel
        };
    }
}
