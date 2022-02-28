

export interface QueryFeaturesParams {
    find: any;
    select?: any;
    sort?: any;
}

export interface UpdateQueryParams {
    find: any;
    toUpdate: any;
}

export interface UpdateByIdQueryParams {
    _id: string;
    toUpdate: any;
}