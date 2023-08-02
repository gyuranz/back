import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './forms/schema.schema';
import { CreateRoomDto, FindInfoDto, JoinRoomDto } from './forms/room.dto';
import { TwilioService } from './twilio.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly twilioService: TwilioService,
  ) {}

  @Get('/get-turn-credentials')
  async getTurnCredentials(@Res() res: Response) {
    try {
      const token = await this.twilioService.generateToken();
      //   console.log('a');
      return res.send({ token });
    } catch (err) {
      console.log('Error occurred when fetching turn server credentials');
      console.log(err);
      return res.send({ token: null });
    }
  }
  @Get('/room/:room_id')
  async joinRoom(
    @Body('user_id') user_id: string,
    @Param('room_id') room_id: string,
  ) {
    return await this.appService.permissionUsertoRoom(user_id, room_id);
  }

  @Get('/:user_id/')
  async mainpage(@Param('user_id') user_id: string) {
    return await this.appService.getUserInfoforMain(user_id);
  }

  @Post('/:user_id/join')
  async joinNewRoom(
    @Param('user_id') user_id: string,
    @Body() setDto: JoinRoomDto,
  ) {
    console.log(setDto)
    return await this.appService.joinNewRoom(user_id, setDto);
  }

  @Post('/:user_id/create')
  async createNewRoom(
    @Param('user_id') user_id: string,
    @Body() setDto: CreateRoomDto,
  ) {
    return await this.appService.createNewRoom(user_id, setDto);
  }

  @Post('/:user_id/finished')
  async findRoomInfoforMain(@Param('user_id') user_id: string, @Body() findInfo:FindInfoDto) {
    console.log(findInfo.room_id);
    const room_id=findInfo.room_id;
    return await this.appService.joinFinishedRoom(user_id,room_id);
  }
}


// @Post('/:user_id/join')
// async findUserInfoforJoin(@Body() setDto: User){
//   return await this.appService.getUserInfoforJoinandCreate(setDto.user_id)
// }

// @Post(':/user_id/create')
// async findUserInfoforCreate(@Body() setDto: User){
//   return await this.appService.getUserInfoforJoinandCreate(setDto.user_id);
// }

/**
 * ! 기존 방 들어갈 때 필요한 것들 추가
 * ! 방식 1. 유저 id와 방 id를 보내면 방 id를 통해 방에 입장권한이 있는 유저인지 확인 후 검증하여 True, False 리턴
 * ! 방식 2. 입장하려는 방 id를 보내면 방 id를 통해 방에 입장권한이 있는 모든 유저명단을 보냄. 프론트에서 검증.
 * ! 리턴해줘야 하는 값,
 * ! 1.
 */
