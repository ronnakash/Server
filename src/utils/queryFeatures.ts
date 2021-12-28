import mongoose, { Document } from "mongoose";
import { NextFunction, Request, Response } from 'express';
import logging from "../config/logging";
import AppError from "./appError";


const NAMESPACE = "QueryFeatures";

class QueryFeatures {
    query: any;
    schema: mongoose.Model<Document, {}, {}, {}>;
    find: any;
    select: any;
    sort: any;
    doc: any;

constructor(schema : mongoose.Model<Document, {}, {}, {}>, query : any) {
    this.schema = schema;
    if (query){
        this.query = query;
        if (query.find)
            this.filter(query.find);
        this.select = this.query.select;
        this.sort = this.query.sort;
    }
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

    async assertOne() {
        this.exec();
        if (this.doc.length != 1) {
            this.doc = new AppError(`asserted one on query which results in ${this.doc.length} documents`, 400);
            return this.doc;
        }
        return this;
    }
    
    

    async exec() : Promise<Document[] | AppError | undefined>{
        this.doc =  await this.schema
            .find(this.find)
            .select(this.select)
            .sort(this.sort)
            .exec();
        
        return this.doc;
    }

    async update(toUpdate: any) : Promise<Document[] | undefined> {
        this.doc =  await this.schema
            .updateMany(this.find, toUpdate)
            .exec();
        return this.doc;
    }

    async delete() {
        if (!this.find)
            return new AppError("no arguments for delete!", 400);
        else{
            this.doc = await this.schema
                .deleteMany(this.find)
                .exec();
            return this.doc;
        }
    }
    
}

export default QueryFeatures;