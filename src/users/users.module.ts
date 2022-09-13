import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserModel from '../schemas/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([
    {
        name: "Note",
        schema: UserModel
    }
])],
controllers: [UsersController],
providers: [UsersService]
})
export class UsersModule {}
