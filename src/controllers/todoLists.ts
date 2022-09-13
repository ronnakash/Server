// import { NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose';
// import ToDoList from '../models/todoList';
// import { IToDoList } from '../interfaces/todoList';
// import AppError from '../utils/appError';
// import Query from '../utils/query';
// import logging from '../config/logging';
// import modelsController from '../controllers/models';


// const NAMESPACE = 'lists Controller';


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /** read */
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// /**  getAllLists
//  * 
//  * get all lists from mongoose
//  * requires token from administrator user
//  * 
// */


// const getAllLists = async (req: Request, res: Response, next: NextFunction) => {
//     modelsController.getAllModels(ToDoList,req,res, next);
// };

// const getListById = async (req: Request, res: Response, next: NextFunction) => {
//     modelsController.getModelById(ToDoList,req,res, next);
// }; 

// /**  getMyLists
//  * 
//  * get all lists that belong to user from mongoose
//  * gets username from token
//  * 
// */

// const getMyLists = async (req: Request, res: Response, next: NextFunction) => {
//     modelsController.getMyModels(ToDoList,req,res, next);
// };


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /** update */
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// /**  updateList
//  * 
//  * edits list by id
//  * user must be author of the list and have a valid token connected to username
//  * req.body must contain id, author, body and title
//  * 
//  * res.body contains the original list before edits
// */

// const updateList = async (req: Request, res: Response, next: NextFunction) => {
//     modelsController.updateModel(ToDoList,req,res, next);
// };


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /** delete */
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// /**  deleteListById
//  * 
//  * delete list by id
//  * user must be author of the list or have administrator permissions
//  * req.body must contain list id and author for list to delete
//  * 
// */

// const deleteListById = async (req: Request, res: Response, next: NextFunction) => {
//     modelsController.deleteModelById(ToDoList,req,res, next);
// };


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /** create */
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// /**  createlist
//  * 
//  * saves new list to database
//  * user must be author of the list and have a valid token connected to username
//  * admins can also create lists for other users
//  * req.body must contain author, body and title
//  * 
// */

// const createList = async (req: Request, res: Response, next: NextFunction) => {
//     let { author, title, body} = req.body;
//     const list = new ToDoList({
//         _id: new mongoose.Types.ObjectId(),
//         author,
//         title, 
//         body
//     });
//     const newlist = await Query.createOne(ToDoList, list);
//     res.locals.result = {
//         message: `Created new list for ${author}`, 
//         newlist
//     }
//     next();
// };


// /** createlists 
//  * 
//  * saves new lists to database
//  * user must be author of the list and have a valid token connected to username
//  * admins can also create lists for other users
//  * req.body must contain list of lists to create
//  * each containing author, body and title
//  * 
// */

// const createLists = async (req: Request, res: Response, next: NextFunction) => {
//     let {lists} = req.body;
//     let newlists: (IToDoList & { _id: any })[] = [];
//     lists.forEach((list: { author: string; title: string; body: string; }) => {
//         let { author, title, body } = list;
//         newlists.push(new ToDoList({
//             author,
//             title,
//             body
//         }));
//     });
//     const Createdlists = await Query.createMany(ToDoList, newlists);
//     res.locals.result = {
//         message: `Created ${Createdlists.length} new lists`,
//         Createdlists
//     }
//     next();
// };


// export default { getListById, createList, getAllLists, updateList, getMyLists, deleteListById, createLists};