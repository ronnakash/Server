import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ToDoList from '../models/todoList';
import { IToDoList } from '../interfaces/todoList';
import AppError from '../utils/appError';
import Query from '../utils/query';
import logging from '../config/logging';


const NAMESPACE = 'lists Controller';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** read */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  getAllLists
 * 
 * get all lists from mongoose
 * requires token from administrator user
 * 
*/

const getAllLists = async (req: Request, res: Response, next: NextFunction) => {
    let docs = await Query
        .getMany(ToDoList, req.body)
        .catch( error => next(error));
    res.locals.result = {
        message: docs ? `Got ${docs.length} results` : `Got no results`,
        docs
    };
    next();
};

const getListById = async (req: Request, res: Response, next: NextFunction) => {
    let { _id } = req.body;
    let list = await Query
        .getOneById(ToDoList, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: `Got list sucsessfuly`,
        list
    };
    next();
}; 



/**  getMyLists
 * 
 * get all lists that belong to user from mongoose
 * gets username from token
 * 
*/

const getMyLists = async (req: Request, res: Response, next: NextFunction) => {
    let username = res.locals.jwt.username;
    let { find, select, sort } = req.body;
    find.author = username;
    let params = {find, select, sort};
    const lists = await Query
        .getMany(ToDoList, params)
        .catch( error => next(error));
    res.locals.result = {
        message: lists ? `Got ${lists.length} results` : `Got no results`,
        lists
    };
    next();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** update */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  updateList
 * 
 * edits list by id
 * user must be author of the list and have a valid token connected to username
 * req.body must contain id, author, body and title
 * 
 * res.body contains the original list before edits
*/

const updateList = async (req: Request, res: Response, next: NextFunction) => {
    let { _id, body, title } = req.body;
    logging.info(NAMESPACE,"id:" , _id);
    const updated = await Query.updateOneById(ToDoList,{
        _id: _id, 
        toUpdate: {body, title}
    }).catch( error => next(error));
    res.locals.result = {
        message: `Updated list sucsessfully`,
        updated
    }
    next();

};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** delete */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  deleteListById
 * 
 * delete list by id
 * user must be author of the list or have administrator permissions
 * req.body must contain list id and author for list to delete
 * 
*/

const deleteListById = async (req: Request, res: Response, next: NextFunction) => {
    let { _id } = req.body;
    let deleted = await Query
        .deleteOneById(ToDoList, _id)
        .catch( error => next(error));
    res.locals.result = {
        message: deleted? `Deleted list sucsessfuly` : `list not found`,
        list: deleted,
        statusCode: deleted? 200 : 400
    };
    next();
};


/** deleteAllUsersLists 
 * 
 * delete all lists of a selected user
 * request must contain username for which lists to delete
 * token must be admin or belong to the user who's lists will be deleted 
 * 
*/

const deleteAllUsersLists = async (req: Request, res: Response, next: NextFunction) => {
    let { author } = req.body;
    let { username, permissions } = res.locals.jwt
    author = author ? author : username;
    if (author !== username && permissions !== "Admin")
        next(new AppError("You don't have permissions to delete other users lists!", 400));
    const deleted = await Query.deleteMany(ToDoList, {find: {author: author}});
    res.locals.result = {
        message: `Deleted lists sucsessfuly`,
        list: deleted
    };
    next();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** create */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**  createlist
 * 
 * saves new list to database
 * user must be author of the list and have a valid token connected to username
 * admins can also create lists for other users
 * req.body must contain author, body and title
 * 
*/

const createList = async (req: Request, res: Response, next: NextFunction) => {
    let { author, title, body} = req.body;
    const list = new ToDoList({
        _id: new mongoose.Types.ObjectId(),
        author,
        title, 
        body
    });
    const newlist = await Query.createOne(ToDoList, list);
    res.locals.result = {
        message: `Created new list for ${author}`, 
        newlist
    }
    next();
};


/** createlists 
 * 
 * saves new lists to database
 * user must be author of the list and have a valid token connected to username
 * admins can also create lists for other users
 * req.body must contain list of lists to create
 * each containing author, body and title
 * 
*/

const createLists = async (req: Request, res: Response, next: NextFunction) => {
    let {lists} = req.body;
    let newlists: (IToDoList & { _id: any })[] = [];
    lists.forEach((list: { author: string; title: string; body: string; }) => {
        let { author, title, body } = list;
        newlists.push(new ToDoList({
            author,
            title,
            body
        }));
    });
    const Createdlists = await Query.createMany(ToDoList, newlists);
    res.locals.result = {
        message: `Created ${Createdlists.length} new lists`,
        Createdlists
    }
    next();
};


export default { getListById, createList, getAllLists, updateList, getMyLists, deleteListById, deleteAllUsersLists, createLists};