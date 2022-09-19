import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';


dotenv.config({path:`${__dirname}/.env`});


require('dotenv').config();

const NAMESPACE = 'Server';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.listen(5000);
    app.enableCors({
        origin: '*',
        allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
        methods: ['PUT, POST, PATCH, DELETE, GET']
    });
}

bootstrap();
