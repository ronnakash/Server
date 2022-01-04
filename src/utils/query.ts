import QueryFeatures from './queryFeatures';
import mongoose from 'mongoose';
import {Document} from 'mongoose';
import AppError from './appError';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';


const NAMESPACE = 'Query Controller';



const getOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await new QueryFeatures(model,params).one();
}

const getOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await new QueryFeatures(model,{find: {_id: _id}}).one();
}

const createOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, doc : mongoose.Document ) => {
    return await doc.save();
}

const updateOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.findOneAndUpdate(find, toUpdate);
}

const updateOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {_id, toUpdate } = params;
    return await model.findOneAndUpdate(_id, toUpdate);
}

const deleteOne = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.findOneAndDelete(params);
}

const deleteOneById = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, _id : string) => {
    return await model.findOneAndDelete({_id: _id});
}

const updateMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    let {find, toUpdate } = params;
    return await model.updateMany(find, toUpdate);
}

const getMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) : Promise<mongoose.Document<any, any, any>[]> => {
    return await new QueryFeatures(model,params).many();
}

const createMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, docs : mongoose.Document[] ) => {
    return await model.insertMany(docs);
}

const deleteMany = async (model : mongoose.Model<mongoose.Document, {}, {}, {}>, params : any) => {
    return await model.deleteMany(params);
}


export default { getOne, getOneById, getMany, createOne, updateOneById, deleteOneById, updateOne, deleteOne, updateMany, createMany, deleteMany};