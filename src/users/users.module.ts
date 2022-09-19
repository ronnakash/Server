import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { MongooseModule } from '@nestjs/mongoose';
import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from '../middleware/authJWT';
import {UserSchema} from '../schemas/user';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

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
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const nri1 : RouteInfo = {
        path: "user/.*",
        method: RequestMethod.ALL
    };
    consumer.apply(GetJWTMiddleware, ExistsJWTMiddleware, ValidateUserOrAdminMiddleware).forRoutes(nri1);
  }
}
