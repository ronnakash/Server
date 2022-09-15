import mongoose, { Schema, Model, Document } from 'mongoose';
import { UserDocument } from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import AppError from '../utils/appError';

const NAMESPACE = 'UserValidation'

export const UserSchema = new Schema<UserDocument>({
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
    },

    googleAccessToken: {
        type: String,
        required: false
    }

},
{
    timestamps: true,
    versionKey: '__v'
});

// UserSchema.pre("init", async function(next) {
//     logging.debug(NAMESPACE, 'checking if user already existes')
//     let users = await Query
//         .getMany(UserModel,{find: {email: this.email}})
//         .catch(error => next(error));
//     if (users && users.length > 0) {
//         logging.debug(NAMESPACE, 'user already existes!')
//         next(new AppError(`Error in mongoose: user ${this.email} already exists`,400))
//     }
//     next()
// });  


// UserSchema.pre("save", async function(next) {
//     if (this.isModified("password")) {
//         logging.info('UserMiddleware', 'hashing user password');
//         this.password = await bcryptjs
//             .hash(this.password, 11)
//     }
// });  


export const UserModel = mongoose.model('User', UserSchema);
