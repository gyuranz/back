/*
*로그인 시 사용자 정보 일치를 확인하는 모듈입니다.
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],    //user모듈에서 추출한 UserService 가져옴
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
