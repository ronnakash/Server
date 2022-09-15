import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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

@Module({
    imports: [
        AuthModule,
        MongooseModule.forRoot(mongoUri, {useUnifiedTopology: true }),
        NotesModule, 
        UsersModule,
    ],

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
