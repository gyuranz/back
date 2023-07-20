import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/user/user.dto';
// import { LoginGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import * as express from 'express';
import { Response } from 'express';
import { JwtAccessAuthGuard } from './jwt-access.guard';
import { User } from 'src/user/user.entity';
import { RefreshTokenDto } from './refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService) { }

    @Post('register')       // register 주소로 POST로 온 요청 처리, class-validator<CreateUserDto>를 통해 유효성 검증하고 회원정보 저장
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.register(userDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() LoginDto: Record<string, any>,
        @Res({ passthrough: true }) res: Response,) {
        const user = await this.authService.validateUser(LoginDto.user_nickname, LoginDto.user_password);
        const accessToken = await this.authService.publishAccessToken(user);
        const refreshToken = await this.authService.publishRefreshToken(user);
        
        await this.userService.setCurrentRefreshToken(accessToken, user.user_id);

        res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });
        return {
            message: '로그인 성공',
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    // @UseGuards(LoginGuard)
    // @Get('test-guard')
    // testGuard() {
    //     return '토큰을 보유하고 있어 로그인이 유지되고 있습니다.'
    // }

    @Get('authenticate')
    @UseGuards(JwtAccessAuthGuard)
    async user(@Req() req: any, @Res() res: Response): Promise<any> {
        const user_id: string = req.user.user_id;
        const verifiedUser: User = await this.userService.getUserbyId(user_id);
        return res.send(verifiedUser);
    }

    @Post('refresh')
    async refresh(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Res({ passthrough: true }) res: Response,
    )    {
        try {
            const newAccessToken = (await this.authService.refresh(refreshTokenDto)).accessToken;
            res.setHeader('Authorization', 'Bearer ' + newAccessToken);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
            });
            res.send({ newAccessToken });
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh-token');
        }
    }
}
