import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs'

const UserSchema: Schema = new Schema(
    {
        username: { 
            type: String,
            required: [true, 'user must have a username']
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
            select: false,
            default: Date.now()
        },

        metadata: {
            type: Object,
        }
    },
    {
        timestamps: true,
        versionKey: '__v'
    }
);


export default mongoose.model<IUser>('User', UserSchema);
