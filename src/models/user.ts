import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs'



const UserSchema: Schema = new Schema<IUser>(
    {
        username: { 
            type: String,
            required: [true, 'user must have a username'],
            unique: true
        },

        email: {
            type: String,
            required: [true, 'user must have an email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },

        password: { 
            type: String,
            required: false,
            select: false
        },

        permissions: { 
            type: String,
            enum: ["Admin", "user"], 
            default: "user" 
        },
        picture: {
            type: String,
            required: false
        },
        googleLogin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: '__v'
    }
);


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
