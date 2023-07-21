import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'    //암호 및 해싱 확인에 일반적으로 사용되는 암호화 해싱 기능
import { JwtService } from '@nestjs/jwt';

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
                422,
            );
        }
        const usernick_validate = await this.userService.getUserbyNickname(userDto.user_nickname);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
        if (usernick_validate) {
            throw new HttpException(
                '해당 닉네임이 이미 존재합니다.',
                422,
            );
        }
        const hashedPw = bcrypt.hashSync(userDto.user_password, 4);
        try {
            const user = await this.userService.createUser({
                ...userDto,
                user_password: hashedPw,
            });
            return {
                userId : user.user_id,
                userNickname : user.user_nickname,
                token: await this.jwtService.signAsync(userDto),
            };
        }
        catch (error) {
            throw new HttpException('회원가입에 실패했습니다. 다시 시도하세요', 500);
        }
        
    }

    //로그인 시 id, 비밀번호 검증 로직
    async validateUser(user_id: string, input_user_password: string) {
        //id 통해 유저 정보 가져옴

        const user = await this.userService.getUserbyId(user_id);
        if(!user){
            throw new HttpException('가입된 아이디가 없습니다.', 422)
        }
        const {user_password: hashedPw, ... payload} = user;

        //!비밀번호가 다르면
        if (!bcrypt.compareSync(input_user_password, hashedPw)) {
            throw new HttpException('비밀번호가 틀립니다',422);
        }


        return {
            userId : user.user_id,
            userNickname : user.user_nickname,
            token: await this.jwtService.signAsync(payload),
        };
    }
}
