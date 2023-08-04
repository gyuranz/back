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
  
  //https 헬스체크를 위한 controller
  @Get('healthCheck')
  healthCheck(@Res() res: Response): void {
    res.status(200).send('Health Check Page');
  }

  // Socket 을 열기 위해 사용하는 함수
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

  // 기존에 들어갔던 방에 재입장.
  @Get('/room/:room_id')
  async joinjoinedRoom(
    @Body('user_id') user_id: string,
    @Param('room_id') room_id: string,
  ) {
    return await this.appService.permissionUsertoRoom(user_id, room_id);
  }

  // 유저의 기존에 들어갔던 방 조회를 위해 정보를 리턴함
  @Get('/:user_id/')
  async mainpage(@Param('user_id') user_id: string) {
    return await this.appService.getUserInfoforMain(user_id);
  }

  // 유저가 새로 방에 입장할 때 사용, id와 비밀번호를 조회하고 승인함.
  @Post('/:user_id/join')
  async joinNewRoom(
    @Param('user_id') user_id: string,
    @Body() setDto: JoinRoomDto,
  ) {
    console.log(setDto);
    return await this.appService.joinNewRoom(user_id, setDto);
  }

  // 유저가 방을 생성할 때 사용, 방 id 와 비밀번호를 생성함.
  @Post('/:user_id/create')
  async createNewRoom(
    @Param('user_id') user_id: string,
    @Body() setDto: CreateRoomDto,
  ) {
    return await this.appService.createNewRoom(user_id, setDto);
  }

  // 유저가 기존에 들어갔던 방에 들어가기 위해 사용
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

