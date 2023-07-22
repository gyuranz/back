import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room, User } from '../dtos&entitys/entity.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class FindService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Room) private roomRepository: Repository<Room>) { }

    // 유저 정보를 ID로 찾기
    async getUserbyId(user_id: string) {
        const result = await this.userRepository.findOne({
            where: { user_id },
        });
        return result;
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyNickname(user_nickname: string) {
        const result = await this.userRepository.findOne({
            where: { user_nickname },
        });
        return result;
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyCode(user_code: number) {
        const result = await this.userRepository.findOne({
            where: { user_code },
        });
        return result;
    }

    async getRoombyId(room_id: number) {
        const result = await this.roomRepository.findOne({
            where: { room_id },
        });
        return result;
    }

    async getRoombyName(room_name: string) {
        const result = await this.roomRepository.findOne({
            where: { room_name },
        });
        return result;
    }
}


