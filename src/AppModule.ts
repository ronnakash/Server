import { Controller, Get, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
// import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import {mongoUri} from './config/secret'
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { GreeterController } from './greeter/greeter.conteroller';
import { ExistsJWTMiddleware, GetJWTMiddleware } from './middleware/authJWT';


@Module({
    imports: [
        AuthModule,
        MongooseModule.forRoot(mongoUri, {useUnifiedTopology: true }),
        NotesModule, 
        UsersModule
    ],
    controllers: [GreeterController],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        //notes
        const nri1 : RouteInfo = {
            path: "notes/my",
            method: RequestMethod.ALL
        };
        //users

        //auth
        const ri1 : RouteInfo = {
            path: "*",
            method: RequestMethod.ALL
        };
        const ri2 : RouteInfo = {
            path: "*",
            method: RequestMethod.ALL
        };
        consumer.apply(GetJWTMiddleware, ExistsJWTMiddleware).forRoutes(nri1);
    }
}


