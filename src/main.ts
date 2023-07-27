import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { CorsOptions ,Cors} from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const socket = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());   //유효성 검사를 할 validatopnPipe 객체 추가
  await app.listen(8080);
}
bootstrap();