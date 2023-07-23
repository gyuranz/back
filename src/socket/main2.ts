import { NestFactory } from '@nestjs/core';
import { AppModule } from './socket.module';
import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));

  await app.listen(8000);
}
bootstrap();
