import { Injectable } from '@nestjs/common';
import { IUserProps, UserDocument } from '../interfaces/user';
import { ModelsService } from '../models/models.service';
import {UserModel as User} from '../schemas/user';
import { UsersRepository } from './users.repository';


@Injectable()
export class UsersService extends ModelsService<UserDocument>{

    constructor(private usersRepository : UsersRepository){
        super();
        super.repository = usersRepository;
    }

    async newUser(user : IUserProps) : Promise<UserDocument>{
        return this.usersRepository.createOne(new User(user))
    }

    async updateModel(model: UserDocument): Promise<UserDocument> {
        let {id, username ,picture} = model;
        const user = await this.repository
            .getOneById(id);
        if (picture) user.picture = picture;
        if (username) user.username = username;
        await this.repository.updateDoc(user);
        return user;
    }

}
