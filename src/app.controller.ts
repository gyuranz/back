import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './dtos&entitys/entity.entity';
import { CreateRoomDto, JoinRoomDto } from './dtos&entitys/room.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/:user_id/finished')
  async findUserInfoforMain(@Req() request) {
    console.log(request);
    const url = request.url;
    const parts = url.split('/');
    const user_id = parts[parts.length - 2];
    console.log(user_id);
    return await this.appService.getUserInfoforMain(user_id);
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
  async joinNewRoom(@Body() setDto: JoinRoomDto) {
    return await this.appService.joinNewRoom(setDto)
  }


  @Post(':/user_id/create')
  async createNewRoom(@Body() setDto: CreateRoomDto) {
    return await this.appService.createNewRoom(setDto);
  }
}
