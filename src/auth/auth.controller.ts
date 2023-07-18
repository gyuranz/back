import { Body,Controller,Get,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('register')       // register 주소로 POST로 온 요청 처리, class-validator<CreateUserDto>를 통해 유효성 검증하고 회원정보 저장
    async register(@Body() userDto: CreateUserDto){
        return await this.authService.register(userDto);
    }
}
