import { Controller, Get, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
// import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import {mongoUri,
    // MONGO_OPTIONS,
    // SERVER_HOSTNAME, 
    // SERVER_PORT,
    // SERVER_TOKEN_EXPIRETIME,
    // SERVER_TOKEN_ISSUER,
    // SERVER_TOKEN_SECRET
} from './config/secret'
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { NotesController } from './notes/notes.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { NotesRepository } from './notes/notes.repository';
import { NotesService } from './notes/notes.service';
import { UserSchema } from './schemas/user';
import { NoteSchema } from './schemas/notes';
import { GreeterController } from './greeter/greeter.conteroller';


@Module({
    imports: [
        AuthModule,
        MongooseModule.forRoot(mongoUri, {useUnifiedTopology: true }),
        NotesModule, 
        UsersModule,
        MongooseModule.forFeature([
            {
                name: "User",
                schema: UserSchema
            },
            {
                name: "Note",
                schema: NoteSchema
            }
        ])
    ],
    controllers: [GreeterController, UsersController, AuthController, NotesController],
    providers: [AuthService, UsersService, UsersRepository, NotesService, NotesRepository]

})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {        
        // const ri1 : RouteInfo = {
        //     path: "*",
        //     method: RequestMethod.ALL
        // };
        // const ri2 : RouteInfo = {
        //     path: "*",
        //     method: RequestMethod.ALL
        // };
        // consumer.apply().forRoutes(ri1,ri2);
    }
}


