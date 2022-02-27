import { Document } from 'mongoose';

export default interface IUser extends Document {
    username: string;
    email : string;
    password: string;
    permissions: string;
    passwordChangedAt: number;
    picture: string;
    googleLogin: Boolean;
}

export interface IUserProps {
    username: string;
    email : string;
    password?: string;
    permissions?: string;
    picture?: string;
}