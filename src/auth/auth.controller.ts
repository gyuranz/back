import { Body, Controller, Get, HttpCode,HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/dtos&entitys/user.dto';
import { LoginGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')       // register 주소로 POST로 온 요청 처리, class-validator<CreateUserDto>를 통해 유효성 검증하고 회원정보 저장
    async signup(@Body() userDto: CreateUserDto) {
        return await this.authService.signup(userDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() LoginDto: Record<string,any>) {
        return this.authService.validateUser(LoginDto.user_id,LoginDto.user_password);
    }

    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard() {
        return '토큰을 보유하고 있어 로그인이 유지되고 있습니다.'
    }
}
