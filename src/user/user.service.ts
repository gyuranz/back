//! 초기 찾는 방식 user_id 자동으로 발급 여부를 몰라 일단 Entity에 unique값으로 지정되어 있는 user_nickname으로 검색, 수정, 삭제 등 진행

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config'

//의존성 주입
@Injectable()
export class UserService {
    //리포지토리 주입
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) { }

    // 유저 생성
    createUser(user): Promise<User> {
        return this.userRepository.save(user);
    }

    // 유저 정보를 ID로 찾기
    async getUserbyId(user_id: string) {
        const result = await this.userRepository.findOne({
            where: { user_id },
        });
        return result;
    }

    async getUserbyCode(user_code: number) {
        const result = await this.userRepository.findOne({
            where: { user_code },
        });
        return result;
    }


    // 유저 정보 업데이트
    async updateUser(user_id, _user) {
        const user: User = await this.getUserbyId(user_id);
        user.user_nickname = _user.user_nickname;
        user.user_password = _user.user_password;
        this.userRepository.save(user);
    }

    //유저 삭제 
    deleteUser(user_id: string) {
        return this.userRepository.delete({ user_id })
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyNickname(user_nickname: string) {
        const result = await this.userRepository.findOne({
            where: { user_nickname },
        });
        return result;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentRefreshToken = await this.getCurrentHashedRefreshToken(refreshToken);
        console.log('321');
        console.log(refreshToken);
        const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
        await this.userRepository.update(userId, {
            currentRefreshToken: currentRefreshToken,
            currentRefreshTokenExp: currentRefreshTokenExp,
        });
    }

    async getCurrentHashedRefreshToken(refreshToken: string) {
        // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다. 
        // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다. 
        const saltOrRounds = 10;
        const currentRefreshToken = await bcrypt.hashSync(refreshToken, saltOrRounds);
        return currentRefreshToken;
    }

    async getCurrentRefreshTokenExp(): Promise<Date> {
        const currentDate = new Date();
        // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt) 
        const currentRefreshTokenExp = new Date(currentDate.getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')));
        return currentRefreshTokenExp;
    }
    async getUserIfRefreshTokenMatches(refreshToken: string, user_id: string): Promise<User> {
        const user: User = await this.getUserbyId(user_id);

        // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
        if (!user.currentRefreshToken) {
            return null;
        }

        console.log(user)

        // 유저 테이블 내에 정의된 암호화된 refreshToken값과 요청 시 body에 담아준 refreshToken값 비교
        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.currentRefreshToken
        );
        console.log(isRefreshTokenMatching)
        // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
        if (isRefreshTokenMatching) {
            return user;
        }
    }
}
