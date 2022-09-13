import { Injectable } from '@nestjs/common';
import mongoose, { Document, Model, EnforceDocument } from 'mongoose';
import { QueryFeaturesParams, UpdateByIdQueryParams, UpdateQueryParams } from '../interfaces/queries';
import AppError from '../utils/appError';
import QueryFeatures from '../utils/queryFeatures';


export abstract class ModelsRepository<T extends Document> {
    model : Model<T>

    protected constructor(model : Model<T>){
        this.model = model;
    }

    async getOne(params : QueryFeaturesParams): Promise<T> {
        return await new QueryFeatures(this.model,params).one();
    }

    async getOneById( _id : string): Promise<T> {
        return await new QueryFeatures(this.model,{find: {_id: _id}}).one();
    }

    async createOne( doc : T): Promise<T> {
        return await doc.save();
    }

    async updateOne( params : UpdateQueryParams): Promise<T> {
        let {find, toUpdate } = params;
        const updatedModel =  await this.model.findOneAndUpdate(find, toUpdate);
        if (updatedModel == null)
            throw new AppError('Document not found', 500);
        return updatedModel;
    }

    async updateOneById( params : UpdateByIdQueryParams): Promise<T> {
        let {_id, toUpdate } = params;
        const updatedModel =  await this.model.findOneAndUpdate({_id: _id}, toUpdate);
        if (updatedModel == null)
            throw new AppError('Document not found', 500);
        return updatedModel;
    }


    async updateDoc( doc : T): Promise<T> {
        return await doc.save().catch(error => {throw new AppError(error.message,500)});
    }

    async deleteOne( params : any): Promise<T> {
        const deletedModel = await this.model.findOneAndDelete(params);
        if (deletedModel == null)
            throw new AppError('Document not found', 500);
        return deletedModel;
    }

    async deleteOneById( _id : any): Promise<T> {
        const deletedModel = await this.model.findOneAndDelete({_id: _id});
        if (deletedModel == null)
            throw new AppError('Document not found', 500);
        return deletedModel;
    }

    async getMany( doc : T): Promise<T> {
        return await doc.save().catch(error => {throw new AppError(error.message,500)});
    }

    // async createMany( docs : T[]): Promise<T> {
    //     return await this.model.insertMany(docs);
    // }

    // async updateMany( params : UpdateQueryParams): Promise<T> {
    //     let {find, toUpdate } = params;
    //     return await this.model.updateMany(find, toUpdate);
    // }



}
