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
        let user = await this.usersService.changePassword(body)
        return {
            message: `Changed password successfuly for user ${user.username}`,
            user: user
        };

    }

}
