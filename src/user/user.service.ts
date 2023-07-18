//! 초기 찾는 방식 user_id 자동으로 발급 여부를 몰라 일단 Entity에 unique값으로 지정되어 있는 user_nickname으로 검색, 수정, 삭제 등 진행

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';


//의존성 주입
@Injectable()
export class UserService {
    //리포지토리 주입
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    // 유저 생성
    createUser(user): Promise<User> {
        return this.userRepository.save(user);
    }

    // 유저 정보를 ID로 찾기
    async getUserbyId(user_id:number){
        const result = await this.userRepository.findOne({
            where:{user_id},
        });
    return result;
    }

    // 유저 정보 업데이트
    async updateUser(user_id, _user){
        const user:User = await this.getUserbyId(user_id);
        console.log(_user);
        user.user_nickname = _user.user_nickname;
        user.user_password = _user.user_password;
        console.log(user);
        this.userRepository.save(user);
    }

    //유저 삭제 
    deleteUser(user_id:number){
        return this.userRepository.delete({user_id})
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyNickname(user_nickname: string) {
        const result = await this.userRepository.findOne({
            where: { user_nickname },
        });
        return result;
    }
    // // 닉네임 기반 유저 정보 업데이트
    // async updateUser(user_nickname, _user) {
    //     const user: User = await this.getUser(user_nickname);
    //     console.log(_user);
    //     user.user_nickname = _user.user_nickname;
    //     user.user_password = _user.user_password;
    //     console.log(user);
    //     this.userRepository.save(user);
    // }

    // // 닉네임 기반 유저 삭제 
    // deleteUser(user_nickname: string) {
    //     return this.userRepository.delete({ user_nickname })
    // }


}
