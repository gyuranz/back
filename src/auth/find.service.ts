import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room, User } from '../forms/schema.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class FindService {

    constructor(
        //! User.name이 의미하는게 뭘까?
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Room.name) private roomModel: Model<Room>) { }

    // 유저 정보를 ID로 찾기
    async getUserbyId(user_id: string) {
        const result = await this.userModel.findOne({ user_id });
        return result;
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyNickname(user_nickname: string) {
        const result = await this.userModel.findOne({ user_nickname });
        return result;
    }

    // 유저 정보를 닉네임 기반으로 찾기
    async getUserbyCode(user_code: number) {
        const result = await this.userModel.findOne({ user_code });
        return result;
    }

    async getRoombyId(room_id: string) {
        const result = await this.roomModel.findOne({ room_id });
        return result;
    }

    async getRoombyName(room_name: string) {
        const result = await this.roomModel.findOne({ room_name });
        return result;
    }
}


