import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());   //유효성 검사를 할 validatopnPipe 객체 추가
  app.use(cookieParser());    //쿠키 파서( 로그인 할 때 발급한 쿠키를 읽는 데에 사용 )
  await app.listen(3000);
}
bootstrap();
