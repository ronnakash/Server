import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserSchema} from '../schemas/user';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([
    {
        name: "Note",
        schema: UserSchema
    }
])],
controllers: [UsersController],
providers: [UsersService, UsersRepository],
exports: [UsersService]
})
export class UsersModule {}
