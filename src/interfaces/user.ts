import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

//interface to pass params to User constructor

export interface UserLoginProps {
    username: string;
    email : string;
    password?: string;
}

export interface UserChangePasswordProps extends UserLoginProps {
    oldPassword: string;
    newPassword: string;
}

export interface UserRegisterProps extends UserLoginProps {
    password: string;
    permissions: string;
    token?: JwtPayload;
}

export interface IUserProps extends UserLoginProps{
    username: string;
    email : string;
    password?: string;
    permissions?: string;
    googleLogin?: Boolean;
    picture?: string;
    googleAccessToken?: string;
}

export interface IUser extends IUserProps{
    password: string;
    permissions: string;
    passwordChangedAt: number;
    googleLogin: Boolean;
    picture: string;
}

//interface that contains all UserDocument fields
export interface UserBaseDocument extends IUser, Document {
    _id: mongoose.ObjectId;
    createdAt: mongoose.Date;
    updatedAt: mongoose.Date;
    __v: number;
    googleAccessToken: string;
}

export interface UserDocument extends UserBaseDocument {
    comparePassword(pass : String) : boolean;
}

