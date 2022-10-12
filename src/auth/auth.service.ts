import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IUserProps, UserDocument } from '../interfaces/user';
import { UsersService } from '../users/users.service';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import axios from 'axios'
import {googleTokenUri, googleLoginConfig} from '../config/secret';



@Injectable()
export class AuthService {

    constructor(private usersService : UsersService){}

    async googleCodeExchage(code : string) {
        const googleResponse = await this.getGoogleTokens(code);
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
        return this.signJWT(user);
    };

    signJWT(user: UserDocument) {
        return jwt.sign(
            {
                _id: user._id,
                username: user.username,
                email: user.email,
                permissions: user.permissions
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: "30 days"
            }
        )
    }

    async getGoogleTokens(code : any) : Promise<{access_token: any; id_token: any;}> {
        const config = googleLoginConfig;
        const googleCodeExchangeRequest = axios.create({
            method: 'POST',
            baseURL: googleTokenUri,
            transformResponse: [(res : any) => {
                let response = JSON.parse(res);
                let {access_token, id_token} = response;
                return {access_token, id_token};
            }],
            timeout: 5000
        });
        const googleResponse = await googleCodeExchangeRequest
            .post('', {
                code,
                ...config
            }).catch(err => {console.log(err)});
        return googleResponse? googleResponse.data : {};
    }

}
