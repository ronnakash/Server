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

// const getAllModels = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     let params = urlParser(req.url);
//     let docs = await Query
//         .getMany(model, {find: params})
//         .catch( error => next(error));
//     res.locals.result = {
//         message: docs ? `Got ${docs.length} results` : `Got no results`,
//         docs
//     };
//     next();
// };

// const getModelById = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     let { _id } = req.body;
//     let doc = await Query
//         .getOneById(model, _id)
//         .catch( error => next(error));
//     res.locals.result = {
//         message: `Got doc sucsessfuly`,
//         doc
//     };
//     next();
// }; 



/**  getMyModels
 * 
 * get all models that belong to user from mongoose
 * gets username from request url
 * 
*/

// const getMyModels = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     let params = urlParser(req.url);
//     const models = await Query
//         .getMany(model, params)
//         .catch( error => next(error));
//     res.locals.result = {
//         message: models ? `Got ${models.length} results` : `Got no results`,
//         models
//     };
//     next();
// };

/**  getMyModelsFromJWT
 * 
 * get all models that belong to user from mongoose
 * gets username from JWT token
 * 
*/


// const getMyModelsFromJWT = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     const models = await Query
//         .getMany(model, {find: {uid: res.locals.token.uid}})
//         .catch(error => next(error));
//     res.locals.result = {
//         message: models ? `Got ${models.length} results` : `Got no results`,
//         models
//     };
//     next();
// };


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

// const updateModel = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     let { id, body, title, color } = req.body;
//     logging.debug(NAMESPACE, "body", req.body)
//     const updated = await Query.updateOneById(model,{
//         _id: id, 
//         toUpdate: {body, title, color}
//     }).catch( error => next(error));
//     res.locals.result = {
//         message: `Updated model sucsessfully`,
//         updated
//     }
//     next();
// };


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

// const deleteModelById = async <T extends Document>(model: Model<T>, req: Request, res: Response, next: NextFunction) => {
//     let { _id } = req.body;
//     let deleted = await Query
//         .deleteOneById(model, _id)
//         .catch( error => next(error));
//     res.locals.result = {
//         message: deleted? `Deleted model sucsessfuly` : `model not found`,
//         model: deleted,
//         statusCode: deleted? 200 : 400
//     };
//     next();
// };



// export default { getAllModels, getModelById, getMyModelsFromJWT, deleteModelById, getMyModels, updateModel};