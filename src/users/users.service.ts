import { Injectable } from '@nestjs/common';
import { UserProps, UserChangePasswordProps, UserDocument } from '../interfaces/user';
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

    async newUser(user : UserProps) : Promise<UserDocument>{
        return this.usersRepository.createOne(new User(user))
    }

    async updateModel(model: UserDocument): Promise<UserDocument> {
        let {id, username, picture, password} = model;
        const user = await this.repository
            .getOneById(id);
        if (picture) 
            user.picture = picture;
        if (username) 
            user.username = username;
        if(password)
            return this.changePassword({user, newPassword: password});
        await user.save();
        return user;
    }

    async changePassword(body : UserChangePasswordProps) {
        let { user, newPassword } = body;
        //get user from database
        // .catch( error => next(error));;
        //compare passwords
        // if (!(await bcryptjs.compare(newPassword, user.password))) 
        //     throw new AppError(`Password mismatch for ${username}`,400);
        await bcryptjs.compare(newPassword, user.password)
        if (await bcryptjs.compare(newPassword, user.password))
            throw new AppError(`Can't change password to the current one`,400);
        // validate new password strength
        else if (!validator.isStrongPassword(newPassword))
            throw new AppError(`New password for user ${user.username} is too weak`, 400);
        const hashPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashPassword;
        user.passwordChangedAt = Date.now();
        await user.save()
        user.password = ""; // hide password hash
        return user;
    }

    // async changePassword(body : UserChangePasswordProps) {
    //     let { username, email, oldPassword, newPassword } = body;
    //     //get user from database
    //     const user = await this.getOne({find: {username: username, email: email}, select: '+passwordChangedAt, +password'})
    //     // .catch( error => next(error));;
    //     //compare passwords
    //     if (!(await bcryptjs.compare(oldPassword, user.password))) 
    //         throw new AppError(`Password mismatch for ${username}`,400);
    //     else if (oldPassword !== newPassword)
    //         throw new AppError(`Can't change password to the current one`,400);
    //     // validate new password strength
    //     else if (!validator.isStrongPassword(newPassword))
    //         throw new AppError(`New password for user ${username} is too weak`, 400);
    //     user.password = newPassword;
    //     user.passwordChangedAt = Date.now();
    //     await user.save()
    //     user.password = ""; // hide password hash
    //     return user;
    // }


}
