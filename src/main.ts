import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const socket = await NestFactory.create<NestExpressApplication>(AppModule);

  socket.use('/public', express.static(path.join(__dirname, '..', 'public')));
  socket.set('view engine', 'pug');
  socket.set('views', path.join(__dirname, 'views'));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());   //유효성 검사를 할 validatopnPipe 객체 추가
  app.use(cookieParser());    //쿠키 파서( 로그인 할 때 발급한 쿠키를 읽는 데에 사용 )
  await app.listen(8080);
}
bootstrap();
