import mongoose, { Schema, Model } from 'mongoose';
import IUser from '../interfaces/user';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';



const UserSchema: Schema = new Schema<UserDocument>(
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

export interface UserDocument extends IUser {
    comparePassword(pass : String) : boolean;
}

UserSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        logging.info('UserMiddleware', 'hashing user password');
      this.password = await bcryptjs
        .hash(this.password, 11)
        .catch( error => next(error))
    }
  });  



const UserModel = mongoose.model<UserDocument, Model<UserDocument>, {}>('User', UserSchema);

export default UserModel;
