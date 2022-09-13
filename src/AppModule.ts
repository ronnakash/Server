import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
// import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';

@Module({
    imports: [],
    controllers: [],
    providers: [],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {        
        const ri1 : RouteInfo = {
            path: "*",
            method: RequestMethod.ALL
        };
        const ri2 : RouteInfo = {
            path: "*",
            method: RequestMethod.ALL
        };
        consumer.apply().forRoutes(ri1,ri2);
    }
}
