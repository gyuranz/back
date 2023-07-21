import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './dtos&entitys/entity.entity';
import { CreateRoomDto, JoinRoomDto } from './dtos&entitys/room.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:user_id')
  async findUserInfoforMain(@Body() setDto: User){
    return await this.appService.getUserInfoforMain(setDto.user_id);
  }

  @Post('/:user_id/join')
  async joinNewRoom(@Body() setDto: JoinRoomDto){
    return await this.appService.joinNewRoom(setDto)
  }

  @Post(':/user_id/create')
  async createNewRoom(@Body() setDto: CreateRoomDto){
    return await this.appService.createNewRoom(setDto);
  }
}
