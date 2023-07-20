import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'    //암호 및 해싱 확인에 일반적으로 사용되는 암호화 해싱 기능
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { jwtConstants } from './constants';
import { RefreshTokenDto } from './refresh-token.dto';
import { Payload } from './payload.interface';


@Injectable()
export class AuthService {

    constructor(private userService: UserService,
        private jwtService: JwtService) { }

    //회원가입
    async register(userDto: CreateUserDto) {
        const userIdValidate = await this.userService.getUserbyNickname(userDto.user_nickname);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
        if (userIdValidate) {
            throw new HttpException(
                '해당 아이디가 이미 존재합니다.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const usernick_validate = await this.userService.getUserbyNickname(userDto.user_nickname);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
        if (usernick_validate) {
            throw new HttpException(
                '해당 닉네임이 이미 존재합니다.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashedPw = bcrypt.hashSync(userDto.user_password, 6);
        try {
            const user = await this.userService.createUser({
                ...userDto,
                user_password: hashedPw,
            });
            user.user_password = undefined;
            return user;
        }
        catch (error) {
            throw new HttpException('서버 에러', 500);
        }
    }

    //로그인 시 닉네임, 비밀번호 검증 로직
    async validateUser(user_nickname: string, input_user_password: string) {
        //닉네임을 통해 유저 정보 가져옴
        const user = await this.userService.getUserbyNickname(user_nickname);
        const hashedPw = user.user_password
        
        //비밀번호가 다르면
        if (!bcrypt.compareSync(input_user_password, hashedPw)) {
            throw new UnauthorizedException('비밀번호가 틀립니다');
        }

        // const payload = { sub: user.user_id, username: user.user_nickname };
        //! 함수로 바꾸자

        return user;
    }

    async publishAccessToken(user:User){
        const {user_password: hashedPw, ... payload} = user;
        const result= await this.jwtService.signAsync(payload);
        console.log(result);
        return result;
    }

    async publishRefreshToken(user:User){
        const {user_password: hashedPw, ... payload} = user;
        console.log(user);
        return await this.jwtService.signAsync(
            {user_id: payload.user_id},
            {secret: jwtConstants.refresh, expiresIn: '3d'}
            );
    }
    
    async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {

        const { refreshToken } = refreshTokenDto;
        // Verify refresh token
        // JWT Refresh Token 검증 로직
        const decodedRefreshToken = this.jwtService.verify(refreshToken, { secret: jwtConstants.refresh }) as Payload;
        
        // Check if user exists

        const userId = decodedRefreshToken.user_id;
        console.log(decodedRefreshToken)
        console.log(refreshToken)
        const user = await this.userService.getUserIfRefreshTokenMatches(refreshToken, userId);
        if (!user) {
            throw new UnauthorizedException('Invalid user!');
        }

        
        // Generate new access token
        const accessToken = await this.publishAccessToken(user);
        
        console.log('여기까진 온다 3')
        return {accessToken}; 
      }
      
}
