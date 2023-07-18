import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());   //유효성 검사를 할 validatopnPipe 객체 추가
  await app.listen(3000);
}
bootstrap();
