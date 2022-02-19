import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs'

enum AuthProvider {
    password = "password",
    google = "google",
    facebook = "facebook",
    github = "github"
};


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
        }
    },
    {
        timestamps: true,
        versionKey: '__v'
    }
);


export default mongoose.model<IUser>('User', UserSchema);
