import { Injectable } from '@nestjs/common';
import { IUserProps, UserDocument } from '../interfaces/user';
import { ModelsService } from '../models/models.service';
import {UserModel as User} from '../schemas/user';


@Injectable()
export class UsersService extends ModelsService<UserDocument>{

    constructor(){
        super();
        super.model = User;
    }

    async newUser(user : IUserProps) : Promise<UserDocument>{
        return super.createOne(new User(user))
    }

    

}
