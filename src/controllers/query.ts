import QueryFeatures from '../utils/queryFeatures';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import logging from '../config/logging';

import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Query Controller';


const getOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await new QueryFeatures(model,{find: {_id: _id}}).exec().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError("error in getOne",500);
    });
}

const createOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, doc : mongoose.Document ) => {
    let docs: mongoose.Document[] = [doc];
    return await model.create(docs).catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(`error in createOne ${error.message}`,501);
    });
}

const updateOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {_id, toUpdate } = params;
    return await new QueryFeatures(model,{find: {_id: _id}}).update(toUpdate).catch((error) => {
        logging.error(NAMESPACE, "!!!!")
        return new AppError("error in updateOne" + error.message,500);
    });
}

const deleteOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await model.findOneAndDelete({_id: _id}).catch((error) => {
        logging.error(NAMESPACE,`!!!!`, error)
        return new AppError("error in deleteOne",500);
    });
}

const updateMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).update(params.toUpdate).catch((error) => {
        logging.error(NAMESPACE, "!!!!")
        return new AppError("error in updateOne" + error.message,500);
    });
}

const getMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    return await new QueryFeatures(model,query).exec().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 501);
    });
}

const createMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, docs : mongoose.Document[] ) => {
    return await model.insertMany(docs).catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 501);
    });
}

const deleteMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    return await new QueryFeatures(model,query).delete().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 501);
    });

}




export default {getOne, getMany, createOne, updateOne, deleteOne, updateMany, createMany, deleteMany};