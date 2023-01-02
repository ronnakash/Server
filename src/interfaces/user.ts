import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

//interface to pass params to User constructor

export interface UserLoginProps {
    username: string;
    email : string;
    password?: string;
}

export interface UserChangePasswordProps  {
    // oldPassword: string;
    user: UserDocument
    newPassword: string;
}

export interface UserRegisterProps extends UserLoginProps {
    password: string;
    permissions: string;
    token?: JwtPayload;
}

export interface UserProps extends UserLoginProps{
    username: string;
    email : string;
    password?: string;
    permissions?: string;
    googleLogin?: Boolean;
    picture?: string;
    googleAccessToken?: string;
}

export interface User extends UserProps{
    password: string;
    permissions: string;
    passwordChangedAt: number;
    googleLogin: Boolean;
    picture: string;
}

//interface that contains all UserDocument fields
export interface UserBaseDocument extends User, Document {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
    __v: number;
    googleAccessToken: string;
}

export interface UserDocument extends UserBaseDocument {
    comparePassword(pass : String) : boolean;
}

