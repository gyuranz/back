//! 초기 찾는 방식 user_id 자동으로 발급 여부를 몰라 일단 Entity에 unique값으로 지정되어 있는 user_nickname으로 검색, 수정, 삭제 등 진행


import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';



@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/signup')
    createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user);
    }

    @Get('/getUser/:user_id')
    async getUserbyId(@Param('user_id') user_id: string) {
        const user = await this.userService.getUserbyId(user_id);
        console.log(user);
        return user;
    }

    @Put('/update/:user_id')
    updateUser(@Param('user_id') user_id: string, @Body() user: UpdateUserDto) {
        console.log(user);
        return this.userService.updateUser(user_id, user);
    }

    @Delete('/delete/:user_id')
    deleteUser(@Param('user_id') user_id: string) {
        return this.userService.deleteUser(user_id);
    }
}

