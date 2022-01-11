import { NextFunction, Request, Response } from 'express';
import mongoose, { Model, Document, ObjectId } from 'mongoose';
import AppError from '../utils/appError';
import Query from '../utils/query';
import logging from '../config/logging';
import urlParser from '../utils/urlParser';

const NAMESPACE = 'Models Controller';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** read */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  getAllModels
 * 
 * get all models from mongoose
 * requires token from administrator user
 * 
*/

const getAllModels = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let params = urlParser(req.url);
    logging.debug(NAMESPACE, `params:`, req.params);
    let docs = await Query
        .getMany(model, {find: params})
        .catch( error => next(error));
    res.locals.result = {
        message: docs ? `Got ${docs.length} results` : `Got no results`,
        docs
    };
    next();
};

const getModelById = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let { _id } = req.body;
    let doc = await Query
        .getOneById(model, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: `Got doc sucsessfuly`,
        doc
    };
    next();
}; 



/**  getMyModels
 * 
 * get all models that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyModels = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let params = urlParser(req.url);
    const models = await Query
        .getMany(model, params)
        .catch( error => next(error));
    res.locals.result = {
        message: models ? `Got ${models.length} results` : `Got no results`,
        models
    };
    next();
};

const getMyModelsFromJWT = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let username = res.locals.jwt.username;
    let { find, select, sort } = req.body;
    if (!find) find = {};
    find.author = username;
    let params = {find, select, sort};
    const models = await Query
        .getMany(model, params)
        .catch( error => next(error));
    res.locals.result = {
        message: models ? `Got ${models.length} results` : `Got no results`,
        models
    };
    next();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** update */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  updateModel
 * 
 * edits model by id
 * user must be author of the model and have a valid token connected to username
 * req.body must contain id, author, body and title
 * 
 * res.body contains the original model before edits
*/

const updateModel = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let { _id, body, title } = req.body;
    const updated = await Query.updateOneById(model,{
        _id: _id, 
        toUpdate: {body, title}
    }).catch( error => next(error));
    res.locals.result = {
        message: `Updated model sucsessfully`,
        updated
    }
    next();

};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  deleteModelById
 * 
 * delete model by id
 * user must be author of the model or have administrator permissions
 * req.body must contain model id and author for model to delete
 * 
*/

const deleteModelById = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let { _id } = req.body;
    let deleted = await Query
        .deleteOneById(model, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: deleted? `Deleted model sucsessfuly` : `model not found`,
        model: deleted,
        statusCode: deleted? 200 : 400
    };
    next();
};


/** deleteAllUsersModels 
 * 
 * delete all models of a selected user
 * request must contain username for which models to delete
 * token must be admin or belong to the user who's models will be deleted 
 * 
*/

const deleteAllUsersModels = async (model: Model<Document>, req: Request, res: Response, next: NextFunction) => {
    let { author } = req.body;
    let { username, permissions } = res.locals.jwt
    author = author ? author : username;
    if (author !== username && permissions !== "Admin")
        next(new AppError("You don't have permissions to delete other users models!", 400));
    const deleted = await Query.deleteMany(model, {find: {author: author}});
    res.locals.result = {
        message: `Deleted models sucsessfuly`,
        model: deleted
    };
    next();
}



export default { getAllModels, getModelById, getMyModelsFromJWT, deleteModelById, getMyModels, deleteAllUsersModels, updateModel};