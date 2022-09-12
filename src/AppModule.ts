import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';

@Module({
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply();
    }
}
