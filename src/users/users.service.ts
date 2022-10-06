import { Injectable } from '@nestjs/common';
import { IUserProps, UserChangePasswordProps, UserDocument } from '../interfaces/user';
import { ModelsService } from '../models/models.service';
import {UserModel as User} from '../schemas/user';
import { UsersRepository } from './users.repository';
import bcryptjs from 'bcryptjs';
import AppError from '../utils/AppError';
import validator from 'validator';


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

    async changePassword(body : UserChangePasswordProps) {
        let { username, email, oldPassword, newPassword } = body;
        //get user from database
        const user = await this.getOne({find: {username: username, email: email}, select: '+passwordChangedAt, +password'})
        // .catch( error => next(error));;
        //compare passwords
        if (!(await bcryptjs.compare(oldPassword, user.password))) 
            throw new AppError(`Password mismatch for ${username}`,400);
        else if (oldPassword !== newPassword)
            throw new AppError(`Can't change password to the current one`,400);
        // validate new password strength
        else if (!validator.isStrongPassword(newPassword))
            throw new AppError(`New password for user ${username} is too weak`, 400);
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        await user.save()
        user.password = ""; // hide password hash
        return user;
    }

}
