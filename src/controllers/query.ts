import QueryFeatures from '../utils/queryFeatures';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import logging from '../config/logging';



const NAMESPACE = 'Query Controller';

const getOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {

    return await new QueryFeatures(model,params).exec().catch( (error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError("error in getOne",500);
    });
}


const getOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await new QueryFeatures(model,{find: {_id: _id}}).exec().catch((error) => {
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

const updateOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {_id, toUpdate } = params;
    return await new QueryFeatures(model, { find: { _id: _id } }).update(toUpdate).catch((error : Error) => {
        logging.error(NAMESPACE, "!!!!")
        return new AppError("error in updateOne" + error.message,500);
    });
}

const updateOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    let {find, toUpdate } = query;
    return await new QueryFeatures(model, { find: find }).update(toUpdate).catch((error : Error) => {
        logging.error(NAMESPACE, "!!!!")
        return new AppError("error in updateOne" + error.message,500);
    });
}

const deleteOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await model.findOneAndDelete({_id: _id}).catch((error) => {
        logging.error(NAMESPACE,`!!!!`, error)
        return new AppError("error in deleteOneById",500);
    });
}

const deleteOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    return await model.findOneAndDelete(query).catch((error) => {
        logging.error(NAMESPACE,`!!!!`, error)
        return new AppError("error in deleteOne",500);
    });
}

const updateMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).update(params.toUpdate).catch((error) => {
        logging.error(NAMESPACE, "!!!!")
        return new AppError("error in updateMany" + error.message,500);
    });
}

const getMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    return await new QueryFeatures(model,query).exec().catch((error) => {
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

const deleteMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, query : any) => {
    return await new QueryFeatures(model,query).delete().catch((error) => {
        logging.error(NAMESPACE,"!!!!")
        return new AppError(error.message,error.status | 500);
    });

}




export default {getOne, getOneById, getMany, createOne, updateOneById, deleteOneById, updateOne, deleteOne, updateMany, createMany, deleteMany};