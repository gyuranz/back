/*
*로그인 시 사용자 정보 일치를 확인하는 모듈입니다.
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Room, RoomSchema, User, UserSchema } from '../forms/schema.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FindService } from './find.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name, schema:UserSchema},{name:Room.name, schema:RoomSchema}]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService,FindService],
  controllers: [AuthController],
  exports: [AuthService,FindService],
})

export class AuthModule {}
