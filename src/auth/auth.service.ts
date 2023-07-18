import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'    //암호 및 해싱 확인에 일반적으로 사용되는 암호화 해싱 기능

@Injectable()
export class AuthService {

    constructor(private userService: UserService) { }

    //회원가입
    async register(userDto: CreateUserDto) {
        const user = await this.userService.getUserbyNickname(userDto.user_nickname);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
        if (user) {
            throw new HttpException(
                '해당 닉네임이 이미 존재합니다.',
                HttpStatus.BAD_REQUEST,
            );
        }

        //패스워드를 암호화함, 유저의 비밀번호를 해시화하고 이것을 2^4회 반복함, 숫자는 2의 거듭제곱 수를 의미, 
        //숫자가 커질수록 해시를 계산하는데 필요한 시간, 리소스가 증가하여 무차별 암호 대입 공격에 대해 안전.
        //단, 숫자를 올릴수록 해싱 프로세스가 느려지고 계산 비용이 높아짐
        //! 일반적인 서비스는 10이지만, 현재 서비스에서 굳이 10까지 필요할까? 
        const encryptedPassword = bcrypt.hashSync(userDto.user_password, 4);

        try {
            const user = await this.userService.createUser({
                ...userDto,
                user_password: encryptedPassword,
            });
            user.user_password = undefined;
            return user;
        }
        catch (error) {
            throw new HttpException('서버 에러', 500);
        }
    }

    //로그인 시 닉네임, 비밀번호 검증 로직
    async validateUser(user_nickname: string, user_password: string){
        //닉네임을 통해 유저 정보 가져옴
        const user = await this.userService.getUserbyNickname(user_nickname); 
        
        //해당 유저가 없으면 검증 실패
        if(!user) {
            return null;
        }
        
        //user에 있는 정보를 불러와 패스워드를 hashedPassword라는 변수에, 나머지를 userInfo 개체에 할당한다.
        const {user_password: hashedPassword, ...userInfo} = user;
        
        //user_password는 유저가 입력한 암호값,
        //hashedPassword는 위에서 닉네임을 통해 찾은 해싱되어있는 함수값이며 이를 비교하여 비밀번호가 일치하는지 확인한다. 일치하면 true 반환
        if (bcrypt.compareSync(user_password, hashedPassword)){
            return userInfo;
        }
        
        //아이디는 일치하고 비밀번호는 일치하지 않는 경우 null
        return null;
    }
}
