import { Injectable } from '@nestjs/common';
import mongoose, { Document, Model, MongooseQueryOptions } from 'mongoose';
import { QueryFeaturesParams, UpdateByIdQueryParams, UpdateQueryParams } from '../interfaces/queries';
import AppError from '../utils/AppError';
import { ModelsRepository } from './models.repository';


// @Injectable()
export abstract class ModelsService<T extends mongoose.Document> {
    repository!: ModelsRepository<T>

    protected constructor(){}

    async getAll(params : any) : Promise<T[]> {
        return await this.repository
            .getMany({find: params});
    }

    async getById(id : string) : Promise<T> {
        return await this.repository
            .getOneById(id);
    }

    async getOne(params : any) : Promise<T> {
        const docs = await this.repository
            .getMany(params);
        if (docs.length == 1)
            return docs[0];
        throw new AppError("Document not found", 400);
    }

    async getMany(params : any) : Promise<T[]> {
        return await this.repository
            .getMany(params);
    }

    async deleteModelById(id : string) : Promise<T>{
        return await this.repository
            .deleteOneById(id);
    }

    abstract updateModel(model : T) : Promise<T>;

    async deleteOne( params : any): Promise<T> {
        const deletedModel = await this.repository.deleteOne(params);
        if (deletedModel == null)
            throw new AppError('Document not found', 500);
        return deletedModel;
    }

    async createModel(model : T) : Promise<T>{
        return this.repository.createOne(model);
    }

}
