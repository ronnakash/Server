import QueryFeatures from '../utils/queryFeatures';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import logging from '../config/logging';


const NAMESPACE = 'Query Controller';


const getOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).one().catch( (error) => {
        return new AppError(`Error in getOne: ${error.message}`, error.statusCode | 500);
    });
}

const getOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await new QueryFeatures(model,{find: {_id: _id}}).one().catch((error) => {
        return new AppError(`Error in getOneById: ${error.message}`, error.statusCode | 500);
    });
}

const createOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, doc : mongoose.Document ) => {
    return await doc.save().catch((error) => {
        return new AppError(`Error in createOne: ${error.message}`, error.statusCode | 500);
    });
}

const updateOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateOne(find, toUpdate).catch((error) => {
        return new AppError(`Error in updateOne: ${error.message}`, error.statusCode | 500);
    });
}

const updateOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {_id, toUpdate } = params;
    return await model.updateOne(_id, toUpdate).catch((error) => {
        return new AppError(`Error in updateOneById: ${error.message}`, error.statusCode | 500);
    });
}

const deleteOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.findOneAndDelete(params).catch((error) => {
        return new AppError(`Error in deleteOne: ${error.message}`, error.statusCode | 500);
    });
}

const deleteOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await model.findOneAndDelete({_id: _id}).catch((error) => {
        return new AppError(`Error in deleteOneById: ${error.message}`, error.statusCode | 500);
    });
}

const updateMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateMany(find, toUpdate).catch((error) => {
        return new AppError(`Error in updateMany: ${error.message}`, error.statusCode | 500);
    });
}

const getMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).many().catch((error) => {
        return new AppError(`Error in getMany: ${error.message}`, error.statusCode | 500);
    });
}

const createMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, docs : mongoose.Document[] ) => {
    return await model.insertMany(docs).catch((error) => {
        return new AppError(`Error in createMany: ${error.message}`, error.statusCode | 500);
    });
}

const deleteMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.deleteMany(params).catch((error) => {
        return new AppError(`error in updateOneById: ${error.message}`, error.statusCode | 500);
    });

}


export default {getOne, getOneById, getMany, createOne, updateOneById, deleteOneById, updateOne, deleteOne, updateMany, createMany, deleteMany};