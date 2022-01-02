import mongoose, { Document, Query } from "mongoose";
import logging from "../config/logging";
import AppError from "./appError";
//import catchAsync from './catchAsync';


const NAMESPACE = "QueryFeatures";

class QueryFeatures {
    params: any;
    schema: mongoose.Model<Document, {}, {}, {}>;
    find: any;
    select: any;
    sort: any;
    doc: Document[] | Document | undefined;

    constructor(schema : mongoose.Model<Document, {}, {}, {}>, params : any) {
    this.schema = schema;
    if (params){
        this.params = params;
        if (params.find)
            this.filter(params.find);
        this.select = this.params.select;
        this.sort = this.params.sort;
    }
    logging.info(NAMESPACE, "this:", this);
}

    filter( find : any ) {
        this.find = find;
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => {
            delete this.find[field];
        });
        return this;
    };

    fields(fields : any) {
        if (fields)
            this.select = fields;
        return this;
    }

    sortBy(sort : any) {
        if (sort)
            this.sort = sort;
        return this;
    }

    async many() : Promise<Document[]>{
        this.doc =  await this.schema
            .find(this.find)
            .select(this.select)
            .sort(this.sort)
            .exec();
        return this.doc;
    }

    async one() : Promise<Document | AppError>{
        this.doc = await this.many();
        if (this.doc.length !== 1)
            throw new AppError(`Error in QueryFeatures.one(): got ${this.doc.length} results`,400);
        return this.doc[0];
    }
    
}

export default QueryFeatures;