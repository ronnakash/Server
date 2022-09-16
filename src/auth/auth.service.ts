import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import getGoogleTokens from '../functions/googleCodeExchange';
import JWT from '../functions/signJWT';
import { IUserProps, UserDocument } from '../interfaces/user';
import { UsersService } from '../users/users.service';
import jwt from 'jsonwebtoken';



@Injectable()
export class AuthService {

    constructor(private usersService : UsersService){}

    async googleCodeExchage(code : string) {
        const googleResponse = await getGoogleTokens(code);
        //if exchange successful
        let {access_token, id_token} = googleResponse;
        const decodedIdToken : any = jwt.decode(id_token);
        return {
            token: decodedIdToken,
            access_token: access_token
        };
    }

    async signInWithGoogle(token : any) : Promise<UserDocument>{
        let {name, email, picture} = token;
        let users = await this.usersService
            .getMany({find: {email}});
        if (users && users.length > 0){
            let user = users[0];
            if (!user.googleLogin){
                user.googleLogin = true;
                user.picture = picture;
                await this.usersService.repository.updateDoc(user);
            }
            return user;
        }
        const userProps : IUserProps = {
            username: name,
            email,
            permissions: 'user',
            picture,
            googleLogin: true,
        };
        return await this.usersService.newUser(userProps)
    }


    async safeLogin(user : UserDocument) {
        return JWT.signJWT(user);
    };

    

}
