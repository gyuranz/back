/*
*유저의 회원가입, 정보수정 시 정보를 REST 방식으로 주고받는 모듈입니다.
*/

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],       //UserService를 외부(다른 모듈)에서 사용할 수 있도록 추출
})
export class UserModule {}
