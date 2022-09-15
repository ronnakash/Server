import { UsersService } from '../users/users.service';
import { Body, Controller, Delete, Get, Next, Param, Patch, Post, Put, Req, Res } from '@nestjs/common';
import urlParser from '../utils/urlParser';
import { NextFunction, Request, Response} from 'express';
import AppError from '../utils/appError';
import validator from 'validator';
import { IUserProps, UserChangePasswordProps, UserLoginProps, UserRegisterProps } from '../interfaces/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JWT from '../functions/signJWT';
import { AuthService } from './auth.service';
import getGoogleTokens from '../functions/googleCodeExchange';


@Controller('auth')
export class AuthController {

    constructor(private usersService : UsersService) {
    }

    @Put("/register")
    async register(@Body() body : UserRegisterProps) {
        let { username, email, password, permissions } = body;
        let token = body.token;
        //check if user exists
        let users = await this.usersService
            .getMany({find: {email}})
            // .catch( error => next(error));
        if (users && users.length > 0)
            throw new AppError(`User already exists: ${users[0]}`,400);
        // check that password is strong
        else if (!validator.isStrongPassword(password || ""))
        throw new AppError(`Provided password for user ${username} is too weak`, 400);
        //check token user permission
        else if (permissions === 'Admin' && token && !(token.permissions === 'Admin'))
            throw new AppError(`You are not authorised to create Admin users!`,400);
        else {
            const userProps : IUserProps = {
                username,
                email,
                password,
                permissions
                };
            const user = await this.usersService.newUser(userProps)
                // .catch( error => next(error));
            return {
                message: `Created new user ${username} sucsessfuly`,
                user: user
            }
        }
    }

    @Post('/login')
    async login(@Body() body : UserLoginProps) {
        let { username, email, password } = body;
        const user = await this.usersService
            .getOne({find: {username: username, email: email}, select: '+password'})
            // .catch( error => next(error));
        if (user && password){
            if (!await bcryptjs.compare(password, user.password))
                // next(new AppError(`password mismatch for user ${username}`, 400));
                throw new AppError(`password mismatch for user ${username}`, 400);
            const token = JWT.signJWT(user);
            user.password = "";
            return {
                message: `Auth successful for ${username}`,
                token: token,
                user: user
            };
        }
        return { message: "Error!!!!"};
    }

    @Patch("/changePassword")
    async changePassword(@Body() body : UserChangePasswordProps) {
        let { username, email, oldPassword, newPassword } = body;
        //get user from database
        const user = await this.usersService
            .getOne({find: {username: username, email: email}, select: '+passwordChangedAt, +password'})
            // .catch( error => next(error));;
        if (user) {
            //compare passwords
            if (!(await bcryptjs.compare(oldPassword, user.password))) 
                throw new AppError(`Password mismatch for ${username}`,400);
            else if (oldPassword !== newPassword)
                throw new AppError(`Can't change password to the current one`,400);
            // validate new password strength
            else if (!validator.isStrongPassword(newPassword))
                throw new AppError(`New password for user ${username} is too weak`, 400);
            else {
                user.password = newPassword;
                user.passwordChangedAt = Date.now();
                await user
                    .save()
                    // .catch( error => next(error));
                user.password = ""; // hide password hash
                return {
                    message: `Changed password successfuly for user ${username}`,
                    user: user
                };
            }
        }
    }

    @Post()
    async googleCodeExchage(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let {code} = req.body;
        //code exchange request
        const googleResponse = await getGoogleTokens(code)
            .catch( error => next(error));
        //if exchange successful
        if (googleResponse){
            let {access_token, id_token} = googleResponse;
            const decodedIdToken : any = jwt.decode(id_token);
            res.locals.result = {
                token: decodedIdToken,
                access_token
            };
            next();
        }
    }

    @Post()
    async googleRegister(@Req() req : Request, @Res() res : Response, @Next() next: NextFunction) {
        let {name, email, picture} = res.locals.result.token;
        let users = await this.usersService
            .getMany({find: {email}})
            .catch( error => next(error));
        if (users){
            let user = users[0];
            if (!user.googleLogin){
                user.googleLogin = true;
                user.picture = picture;
                await this.usersService.updateDoc(user);
            }
            res.locals.result = {
                message: `Found google user ${name} sucsessfuly`,
                user: user, 
                new: false
            };
        }
        else{
            const userProps : IUserProps = {
                username: name,
                email,
                permissions: 'user',
                picture,
                googleLogin: true,
                };
            const user = await this.usersService.newUser(userProps).catch(err=>next(err));
            res.locals.result = {
                message: `Created new user ${name} sucsessfuly`,
                user: user, 
                new: true
            };
        }
        next();
    }

}
