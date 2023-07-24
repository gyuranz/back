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
  // app.enableCors({
  //   origin: '*', // 모든 도메인에서 요청을 허용하려면 '*'를 사용합니다. 필요에 따라 특정 도메인을 지정할 수 있습니다.
  //   allowedHeaders: 'Content-Type', // 허용할 헤더를 지정합니다. 필요에 따라 추가할 수 있습니다.
  // });

  // socket.use('/public', express.static(path.join(__dirname, '..', 'public')));
  // socket.set('view engine', 'pug');
  // socket.set('views', path.join(__dirname, 'views'));
  app.enableCors();
  // express().use(cors())
  // app.use(cors({ origin: 'http://localhost:3000' }));
  // const corsOptions: CorsOptions = {
  //   origin: 'http://localhost:3000',
  //   // You can add more configuration options here if needed
  // };

  app.useGlobalPipes(new ValidationPipe());   //유효성 검사를 할 validatopnPipe 객체 추가
  await app.listen(8080);
}
bootstrap();