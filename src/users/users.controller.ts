import { Controller, Delete, Next, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import {UserDocument} from '../interfaces/user';
import { ModelsController } from '../models/models.controller';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends ModelsController<UserDocument>{

    constructor( //@InjectModel("Note") private noteModel : Model<NoteDocument>,
            private usersService : UsersService) {
        super(usersService)
    }   

    @Put()
    async updateModel(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let {id, username ,picture} = req.body;
        const user = await this.usersService
            .getOneById(id)
            .catch( error => next(error));
        if (user) {
            if (picture) user.picture = picture;
            if (username) user.username = username;
            await this.usersService.updateDoc(user).catch( error => next(error));
            res.locals.result = {
                message: user? `Updated user ${username}` : `Can't find user to update`,
                user: user,
                statusCode: user? 200 : 500
            };
            next();
        }
    }
    
    @Delete()
    async deleteByUsername(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let { username } = req.body;
        let user = await this.usersService
            .deleteOne({find: {username: username}})
            .catch( error => next(error));
        res.locals.result = {
            message: `Deleted user ${username}`,
            user: user
        }
        next();
    }

}
