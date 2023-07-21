import { Injectable,UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User } from './dtos&entitys/entity.entity';

@Injectable()
export class AppService {
  constructor(
    private authService:AuthService) { }


    //유저의 아이디를 근거로, 과거에 들어갔던 방들의 목록을 조회해서 리턴함
    async getUserInfoforMain(user_id:string) {
      const user = await this.authService.getUserbyId(user_id);

      return{
        userId: user.user_id,
        userNickname: user.user_nickname,
        user_joined_room: user.user_joined_room
      }
    }

    async joinNewRoom(room_invite_key){
      
    }
}
