import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')       // register 주소로 POST로 온 요청 처리, class-validator<CreateUserDto>를 통해 유효성 검증하고 회원정보 저장
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.register(userDto);
    }

    //! 로그인 매서드는 Request, Response를 모두 사용해야 하므로 Body, Param 대신 직접 사용.
    // Response는 쿠키를 설정할 때 사용됨.
    @Post('login')
    async login(@Request() req, @Response() res) {

        //서비스에서 만든 validateUser함수는 비밀번호를 제외한 나머지 정보를 가져옴.
        const userInfo = await this.authService.validateUser(
            req.body.user_nickname,
            req.body.user_password,
        );

        //유저 정보가 있으면
        if (userInfo) {

            //쿠키 정보를 Response에 저장
            res.cookie('login', JSON.stringify(userInfo), {
                httpOnly: false,        //브라우저에서 읽을 수 있도록 함
                maxAge: 1000 * 60 * 60 * 24 * 7,    //쿠키가 7일(ms단위, 1000ms * 60초 * 60분 *24시간 *7일)동안 유지되도록 함
            });
        }
        return res.send({message:'login success'})
    }
}
