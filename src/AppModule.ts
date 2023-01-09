import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import {mongoUri} from './config/secret'
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { GreeterController } from './greeter/greeter.conteroller';
import { GetJWTMiddleware } from './middleware/authJWT';
import { routeInfos } from './interfaces/middleware';
// import { ExistsJWTMiddleware, GetJWTMiddleware, ValidateUserOrAdminMiddleware } from './middleware/authJWT';
// import { routeInfos } from './interfaces/middleware';


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
        consumer.apply(GetJWTMiddleware).forRoutes(routeInfos.allRoutes);
        // consumer.apply(ExistsJWTMiddleware, ValidateUserOrAdminMiddleware).forRoutes(routeInfos.notesRoutes, routeInfos.userRoutes);
        
    }
}


