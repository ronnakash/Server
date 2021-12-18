import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const func = (f: (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction) => Promise<any>) => {
    return (req : Request, res: Response,next : NextFunction) => {
        f(req,res,next).catch(next);
    };
};   

export default func;