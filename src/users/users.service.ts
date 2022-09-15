import { Injectable } from '@nestjs/common';
import { IUserProps, UserDocument } from '../interfaces/user';
import { ModelsService } from '../models/models.service';
import {UserModel as User} from '../schemas/user';


@Injectable()
export class UsersService extends ModelsService<UserDocument>{

    constructor(private notesRepository : NotesRepository){
        super();
        super.repository = User;
    }

    async newUser(user : IUserProps) : Promise<UserDocument>{
        return super.createOne(new User(user))
    }

    updateModel(model: UserDocument): Promise<UserDocument> {
        throw new Error('Method not implemented.');
    }

}
