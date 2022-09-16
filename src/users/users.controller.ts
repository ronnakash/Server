import { Body, Controller, Delete, Next, Patch, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import validator from 'validator';
import {UserChangePasswordProps, UserDocument} from '../interfaces/user';
import { ModelsController } from '../models/models.controller';
import AppError from '../utils/appError';
import { UsersService } from './users.service';
import bcryptjs from 'bcryptjs';


@Controller('users')
export class UsersController extends ModelsController<UserDocument>{

    constructor( //@InjectModel("Note") private noteModel : Model<NoteDocument>,
            private usersService : UsersService) {
        super(usersService)
    }   

    
    @Delete()
    async deleteByUsername(@Body() body: UserDocument) {
        let { username } = body;
        let user = await this.usersService
            .deleteOne({find: {username: username}})
        return {
            message: `Deleted user ${username}`,
            user: user
        };
    }

    @Patch("/changePassword")
    async changePassword(@Body() body : UserChangePasswordProps) {
        let { username, email, oldPassword, newPassword } = body;
        //get user from database
        const user = await this.usersService
            .getOne({find: {username: username, email: email}, select: '+passwordChangedAt, +password'})
            // .catch( error => next(error));;
        if (user) {
            //compare passwords
            if (!(await bcryptjs.compare(oldPassword, user.password))) 
                throw new AppError(`Password mismatch for ${username}`,400);
            else if (oldPassword !== newPassword)
                throw new AppError(`Can't change password to the current one`,400);
            // validate new password strength
            else if (!validator.isStrongPassword(newPassword))
                throw new AppError(`New password for user ${username} is too weak`, 400);
            else {
                user.password = newPassword;
                user.passwordChangedAt = Date.now();
                await user.save()
                user.password = ""; // hide password hash
                return {
                    message: `Changed password successfuly for user ${username}`,
                    user: user
                };
            }
        }
    }

}
