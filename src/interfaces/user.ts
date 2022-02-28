import { Document } from 'mongoose';

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
}

export default interface UserDocument extends UserBaseDocument {
    comparePassword(pass : String) : boolean;
}

