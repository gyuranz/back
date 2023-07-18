//! 초기 찾는 방식 user_id 자동으로 발급 여부를 몰라 일단 Entity에 unique값으로 지정되어 있는 user_nickname으로 검색, 수정, 삭제 등 진행


import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';



@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/create')
    createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user);
    }

    // @Get('/getUser/:user_nickname')
    // async getUser(@Param('user_nickname') user_nickname: string) {
    //     const user = await this.userService.getUser(user_nickname);
    //     console.log(user);
    //     return user;
    // }

    // @Put('/update/:user_nickname')
    // updateUser(@Param('user_nickname') user_nickname: string, @Body() user: User){
    //     console.log(user);
    //     return this.userService.updateUser(user_nickname, user);
    // }

    // @Delete('/delete/:user_nickname')
    // deleteUser(@Param('user_nickname') user_nickname: string){
    //     return this.userService.deleteUser(user_nickname);

        @Get('/getUser/:user_id')
    async getUser(@Param('user_id') user_id: number) {
        const user = await this.userService.getUser(user_id);
        console.log(user);
        return user;
    }

    @Put('/update/:user_id')
    updateUser(@Param('user_id') user_id: number, @Body() user: UpdateUserDto){
        console.log(user);
        return this.userService.updateUser(user_id, user);
    }

    @Delete('/delete/:user_id')
    deleteUser(@Param('user_id') user_id: number){
        return this.userService.deleteUser(user_id);
    }
}

