import QueryFeatures from '../utils/queryFeatures';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import logging from '../config/logging';


const NAMESPACE = 'Query Controller';


const getOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).one().catch( (error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError("error in getOne",500);
    });
}

const getOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await new QueryFeatures(model,{find: {_id: _id}}).one().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError("error in getOneByID",500);
    });
}

const createOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, doc : mongoose.Document ) => {
    return await doc.save().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(`error in createOne ${error.message}`,501);
    });
}

const updateOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateOne(find, toUpdate).catch((error) => {
        return new AppError(`error in updateOneById: ${error.message}`, error.statusCode | 500);
    });
}

const updateOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {_id, toUpdate } = params;
    return await model.updateOne(_id, toUpdate).catch((error) => {
        return new AppError(`error in updateOneById: ${error.message}`, error.statusCode | 500);
    });
}

const deleteOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.findOneAndDelete(params).catch((error) => {
        logging.error(NAMESPACE,`!!!!`, error)
        return new AppError("error in deleteOne",500);
    });
}

const deleteOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await model.findOneAndDelete({_id: _id}).catch((error) => {
        logging.error(NAMESPACE,`!!!!`, error)
        return new AppError("error in deleteOneById",500);
    });
}

const updateMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateMany(find, toUpdate).catch((error) => {
        return new AppError(`error in updateOneById: ${error.message}`, error.statusCode | 500);
    });
}

const getMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).many().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 500);
    });
}

const createMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, docs : mongoose.Document[] ) => {
    return await model.insertMany(docs).catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 500);
    });
}

const deleteMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.deleteMany(params).catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 500);
    });

}


export default {getOne, getOneById, getMany, createOne, updateOneById, deleteOneById, updateOne, deleteOne, updateMany, createMany, deleteMany};