import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([
    {
        name: "User",
        schema: UserSchema
    }
])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UsersRepository],
  // exports: [AuthController]
})
export class AuthModule {}
