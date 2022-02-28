import mongoose, { Document } from 'mongoose';

export interface IUserProps {
    username: string;
    email : string;
    password?: string;
    permissions?: string;
    picture?: string;
}

interface IUser extends IUserProps{
    password: string;
    permissions: string;
    passwordChangedAt: number;
    googleLogin: Boolean;
    picture: string;
}


interface UserBaseDocument extends IUser, Document {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
    __v: number;
}

export default interface UserDocument extends UserBaseDocument {
    comparePassword(pass : String) : boolean;
}

