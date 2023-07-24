import { Injectable, HttpException } from '@nestjs/common';
import { FindService } from './auth/find.service';
import * as bcrypt from "bcrypt";
import { CreateRoomDto, JoinRoomDto } from './forms/room.dto';
import { Room } from './forms/schema.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { find } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private findService: FindService,
    @InjectModel(Room.name) private roomModel: Model<Room>) { }


  //유저의 아이디를 근거로, 유저의 정보를 비밀번호 제외하고 모두 리턴함
  async getUserInfoforMain(user_id: string) {
    const user = await this.findService.getUserbyId(user_id);

    // const { user_password, ...userexceptPW } = user;
    // console.log(userexceptPW);
    return {
      // userexceptPW
      user
    };
  }

  async permissionUsertoRoom(user_id: string, room_id: string) {
    const room = await this.findService.getUserbyId(room_id);
    //! room_joined_user에 유저 정보가 있는지 조회하기
    // room..find();
  }

  //유저의 아이디를 근거로, 과거에 들어갔던 방들의 목록을 조회해서 리턴함
  async getUserInfoforJoinandCreate(user_id: string) {
    const user = await this.findService.getUserbyId(user_id);
    const { user_password, ...userexceptPWandJoinRoom } = user;
    console.log(userexceptPWandJoinRoom)
    return {
      userexceptPWandJoinRoom
    };
  }



  //방에 입장하고, 방 코드, 초대키, 방 이름 리턴
  async joinNewRoom(user_id, joinRoomDto: JoinRoomDto) {

    const room = await this.findService.getRoombyId(joinRoomDto.room_id);
    if (!room) {
      throw new HttpException('일치하는 방이 없습니다.', 422);
    }
    const { room_password: hashedPw, ...payload } = room;
    if (!bcrypt.compareSync(joinRoomDto.room_password, hashedPw)) {
      throw new HttpException('해당 방의 비밀번호와 일치하지 않습니다.', 422);
    }
    // 유저 정보를 가져와서
    const user = await this.findService.getUserbyId(user_id);
    //유저 닉네임을 가져온 유저의 정보로 등록

    // 양식에 맞게 미리 등록.
    // 방이 가지고 있는 유저들의 데이터
    const input_room_joined_user = { user_id: user.user_id, user_nickname: user.user_nickname };
    //! room summary가 맞나?
    //유저가 가지고 있는 유저가 들어갔던 데이터
    const input_user_joined_room = { room_id: room.room_id, room_name: room.room_name, summary: room.room_summary };


    // 방에 이전 방문 기록이 있는지 확인하고 없으면 room_joined_user_list에 user_code 추가
    if (!room.room_joined_user_list.find((user) => user.user_id === user_id)) {
      room.room_joined_user_list.push(input_room_joined_user);
    };

    // 유저가 이전 방문 기록이 있는지 확인하고 없으면 user_joined_room_list 에 room_id 추가
    if (!user.user_joined_room_list.find((room) => room.room_id === joinRoomDto.room_id)) {
      user.user_joined_room_list.push(input_user_joined_room);
    };
    
    return {
      room_id: room.room_id,
      room_name: room.room_name,
      room_summary: room.room_summary
    };
  }

  // 방을 만들고, 방 코드, 방 이름, 초대키 리턴
  async createNewRoom(user_id, createRoomDto: CreateRoomDto) {
    const roomIdValidate = await this.findService.getRoombyName(createRoomDto.room_name);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
    if (roomIdValidate) {
      throw new HttpException(
        '해당 방 이름이 이미 존재합니다.',
        422,
      );
    }
    //비밀번호 4번 해싱
    const hashedPw = bcrypt.hashSync(createRoomDto.room_password, 4);
    const createroomid = this.generateRandomString(6);
    console.log(createroomid);
    //방을 만들고 필요한 데이터 리턴
    const user = await this.findService.getUserbyId(user_id);

    try {
      const room = await this.createRoom({ room_password: hashedPw, room_id: createroomid, room_name: createRoomDto.room_name });
    // 양식에 맞게 미리 등록.
    // 방이 가지고 있는 유저들의 데이터
    const input_room_joined_user = { user_id: user.user_id, user_nickname: user.user_nickname };
    //! room summary가 맞나?
    //유저가 가지고 있는 유저가 들어갔던 방 데이터
    const input_user_joined_room = { room_id: room.room_id, room_name: room.room_name, summary: room.room_summary };

    //room_joined_user_list에 user_code 추가
      room.room_joined_user_list.push(input_room_joined_user);
    // user_joined_room_list 에 room_id 추가
      user.user_joined_room_list.push(input_user_joined_room);

      return {
        room_name: room.room_name,
        room_id: room.room_id,
        room_password: createRoomDto.room_password
      }
    } catch {
      throw new HttpException('방 만들기에 실패했습니다. 다시 시도하세요', 500)
    }
  }

  createRoom(room): Promise<Room> {
    return this.roomModel.create(room);
  }

  zerofill(value: number, digits: number) {
    var result = value.toString();
    return result.padStart(digits, '0')
  }

  generateRandomString(length: number): string {
    const bytes = randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
  }
}
