import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { MongooseModule } from '@nestjs/mongoose';
// import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';
import { ModelsModule } from '../models/models.module';
import {UserSchema} from '../schemas/user';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UserDocument, UserProps } from '../interfaces/user';

@Module({
  imports: [MongooseModule.forFeature([
    {
        name: "User",
        schema: UserSchema
    }
])],
controllers: [UsersController],
providers: [UsersService, UsersRepository],
exports: [UsersService]
})
export class UsersModule extends ModelsModule<UserProps, UserDocument> {
  configure(consumer: MiddlewareConsumer): void {
    throw new Error('Method not implemented.');
  }

  constructor(){
    super("user");
  }

}
