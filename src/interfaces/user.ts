import mongoose, { Document } from 'mongoose';

//interface to pass params to User constructor
export interface IUserProps {
    username: string;
    email : string;
    password?: string;
    permissions?: string;
    googleLogin?: Boolean;
    picture?: string;
    googleAccessToken?: string;
}

interface IUser extends IUserProps{
    password: string;
    permissions: string;
    passwordChangedAt: number;
    googleLogin: Boolean;
    picture: string;
}

//interface that contains all UserDocument fields
interface UserBaseDocument extends IUser, Document {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
    __v: number;
    googleAccessToken: string;
}

export default interface UserDocument extends UserBaseDocument {
    comparePassword(pass : String) : boolean;
}

