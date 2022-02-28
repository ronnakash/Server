import QueryFeatures from './queryFeatures';
import mongoose from 'mongoose';
import {Document, Model} from 'mongoose';
import AppError from './appError';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Query Controller';



const getOne = async <T extends Document>(model : Model<T>, params : any) : Promise<T> => {
    return await new QueryFeatures(model,params).one();
}

const getOneById = async <T extends Document>(model : Model<T>, _id : string) : Promise<T> => {
    return await new QueryFeatures(model,{find: {_id: _id}}).one();
}

const createOne = async <T extends Document>(model : Model<T>, doc : T ) : Promise<T> => {
    return await doc.save();
}


//?????
const updateOne = async <T extends Document>(model : Model<T>, params : any) : Promise<T | AppError> => {
    let {find, toUpdate } = params;
    return await model.findOneAndUpdate(find, toUpdate) || new AppError('Document not found', 500);
}

const updateDoc = async <T extends Document>(doc : T) : Promise<T> => {
    return await doc.save().catch(error => {throw new AppError(error.message,500)});
}

const updateOneById = async <T extends Document>(model : Model<T>, params : any) : Promise<T | AppError> => {
    let {_id, toUpdate } = params;
    return await model.findOneAndUpdate({_id: _id}, toUpdate) || new AppError('Document not found', 500);
}

const deleteOne = async <T extends Document>(model : Model<T>, params : any) : Promise<T | AppError> =>  {
    return await model.findOneAndDelete(params) || new AppError('Document not found', 500);
}

const deleteOneById = async <T extends Document>(model : Model<T>, _id : string) : Promise<T | AppError> => {
    return await model.findOneAndDelete({_id: _id}) || new AppError('Document not found', 500);
};

const getMany = async <T extends Document>(model : Model<T>, params : any) : Promise<T[]> => {
    return await new QueryFeatures(model,params).many();
}

const createMany = async <T extends Document>(model : Model<T>, docs : Document[]) : Promise<T[]> => {
    return await model.insertMany(docs);
}

const updateMany = async <T extends Document>(model : Model<T>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateMany(find, toUpdate);
} 

const deleteMany = async <T extends Document>(model : Model<T>, params : any) => {
    return await model.deleteMany(params);
}


export default { getOne, getOneById, getMany, createOne, updateOneById, deleteOneById, updateOne, updateDoc, deleteOne, updateMany, createMany, deleteMany};