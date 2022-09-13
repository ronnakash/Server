import { Injectable } from '@nestjs/common';
import UserDocument, { IUserProps } from '../interfaces/user';
import { ModelsService } from '../models/models.service';
import User from '../schemas/user';


@Injectable()
export class UsersService extends ModelsService<UserDocument>{

    async newUser(user : IUserProps) : Promise<UserDocument>{
        return super.createOne(new User(user))
    }

    

}
