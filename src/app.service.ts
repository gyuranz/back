import { Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService) { }
  // async checkHaveToken(token: string) {
  //   //토큰이 있으면
  //   if (token) {
  //     try {
  //       //토큰 정보를 해석하여 Id, nickname값을 보내줌
  //       const payload = await this.jwtService.verifyAsync(
  //         token, {
  //         secret: jwtConstants.secret
  //       }
  //       );
  //       return {
  //         userId: payload.user_id,
  //         userNickName: payload.user_nickname
  //       }
  //     }
  //     //오류 시 오류메시지 보내기
  //     catch {
  //       throw new UnauthorizedException("토큰인증에 실패했습니다.");
  //     }
  //   }
  //   return false;
  // }
}
