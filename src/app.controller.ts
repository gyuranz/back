import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './forms/schema.schema';
import { CreateRoomDto, JoinRoomDto } from './forms/room.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:user_id/finished')
  async findUserInfoforMain(@Body() setDto: User){
    return await this.appService.getUserInfoforMain(setDto.user_id);
  }

  // @Post('/:user_id/join')
  // async findUserInfoforJoin(@Body() setDto: User){
  //   return await this.appService.getUserInfoforJoinandCreate(setDto.user_id)
  // }

  // @Post(':/user_id/create')
  // async findUserInfoforCreate(@Body() setDto: User){
  //   return await this.appService.getUserInfoforJoinandCreate(setDto.user_id);
  // }

  @Post('/:user_id/join')
  async joinNewRoom(@Body() setDto: JoinRoomDto){
    return await this.appService.joinNewRoom(setDto)
  }


  @Post(':/user_id/create')
  async createNewRoom(@Body() setDto: CreateRoomDto){
    return await this.appService.createNewRoom(setDto);
  }
}
