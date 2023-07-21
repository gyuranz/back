import { Injectable, HttpException } from '@nestjs/common';
import { FindService } from './auth/find.service';
import * as bcrypt from "bcrypt";
import { CreateRoomDto, JoinRoomDto } from './dtos&entitys/room.dto';
import { Room } from './dtos&entitys/entity.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    private findService: FindService,
    @InjectRepository(Room) private roomRepository: Repository<Room>) { }


  //유저의 아이디를 근거로, 과거에 들어갔던 방들의 목록을 조회해서 리턴함
  async getUserInfoforMain(user_id: string) {
    const user = await this.findService.getUserbyId(user_id);

    return {
      userId: user.user_id,
      userNickname: user.user_nickname,
      user_joined_room: user.user_joined_room
    };
  }

  //방에 입장하고, 방 코드, 초대키, 방 이름 리턴
  async joinNewRoom(joinRoomDto: JoinRoomDto) {

    const room = await this.findService.getRoombyInviteKey(joinRoomDto.room_invite_key);
    if (!room) {
      throw new HttpException('일치하는 방이 없습니다.', 422);
    }
    const { room_password: hashedPw, ...payload } = room;
    if (!bcrypt.compareSync(joinRoomDto.room_password, hashedPw)) {
      throw new HttpException('해당 방의 비밀번호와 일치하지 않습니다.', 422);
    }

    //! if (room.room_joined_user !== )
    //! 방에 접근 권한이 있는지 확인하고 없으면 room_joined_user에 user_code 추가

    return {
      room_code: room.room_code,
      room_invite_key: room.room_invite_key,
      room_name: room.room_name
    };
  }

  // 방을 만들고, 방 코드, 방 이름, 초대키 리턴
  async createNewRoom(createRoomDto: CreateRoomDto) {
    const roomIdValidate = await this.findService.getRoombyName(createRoomDto.room_name);   //닉네임을 기반으로 같은 닉네임을 가진 유저가 있는지 확인 후 중복검사
    if (roomIdValidate) {
      throw new HttpException(
        '해당 방 이름이 이미 존재합니다.',
        422,
      );
    }
    //비밀번호 4번 해싱
    const hashedPw = bcrypt.hashSync(createRoomDto.room_password, 4);

    //방을 만들고 필요한 데이터 리턴
    try {
      const room = await this.createRoom({
        room_password: hashedPw, ...createRoomDto
      })
      console.log(createRoomDto.room_password);
      console.log(hashedPw);
      console.log(room.room_password);

      return {
        room_code: room.room_code,
        room_name: room.room_name,
        room_invite_key: room.room_invite_key,
      }
    } catch {
      throw new HttpException('방 만들기에 실패했습니다. 다시 시도하세요', 500)
    }
  }

  createRoom(room): Promise<Room> {
    return this.roomRepository.save(room);
  }
}
