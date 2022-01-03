import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs'

const UserSchema: Schema = new Schema(
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
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },

        permissions: { 
            type: String,
            enum: ["Admin", "user"], 
            default: "user" 
        },

        passwordChangedAt: {
            type: Number,
            select: false
        }

    },
    {
        timestamps: true,
        versionKey: '1'
    }
);


export default mongoose.model<IUser>('User', UserSchema);
