import mongoose, { Document, Model } from "mongoose";
import AppError from "./AppError";
//import catchAsync from './catchAsync';


class Query<T extends Document> {
    params: any;
    schema: Model<T, any, any>;
    find: any;
    select: any;
    sort: any;
    docs: T[] = [];

    constructor(schema : Model<T, any, any>, params : any) {
    this.schema = schema;
    if (params){
        this.params = params;
        if (params.find)
            this.filter(params.find);
        this.select = this.params.select;
        this.sort = this.params.sort;
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

    async many() : Promise<T[]>{
        this.docs = await this.schema
            .find(this.find)
            .select(this.select)
            .sort(this.sort)
            .exec()
            .catch( (error: { message: any; }) => {throw new AppError(`error in mongoose: ${error.message}`,500)});
        return this.docs;
    }

    async one() : Promise<T> {
        this.docs = await this.many();
        if (this.docs.length !== 1)
            throw new AppError(`Error in Query.one(): got ${this.docs.length} results`,400);
        return this.docs[0];
    }

}

export default Query;