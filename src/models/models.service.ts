import { Injectable } from '@nestjs/common';
import mongoose, { Document, Model, MongooseQueryOptions } from 'mongoose';
import { QueryFeaturesParams, UpdateByIdQueryParams, UpdateQueryParams } from '../interfaces/queries';
import AppError from '../utils/appError';
import QueryFeatures from '../utils/queryFeatures';
import { ModelsRepository } from './models.repository';


@Injectable()
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

    async getMany(params : any) : Promise<T[]> {
        return await this.repository
            .getMany(params);
    }

    async deleteModelById(id : string) : Promise<T>{
        return await this.repository
            .deleteOneById(id);
    }

    abstract updateModel(model : T) : Promise<T>;



}
