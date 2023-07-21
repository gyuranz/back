import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';

//CanActivate 매서드는 요청을 진행할 수 있는지 여부를 나타내는 부울 값 또는 Promise<boolean> 반환, 인증이 되었으면 true, false는 403 에러를 보내줌
@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: any): Promise<boolean> {

        //컨텍스트는 Request나 Response 객체를 얻어오는데에 사용. 현재 Request를 가져옴
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        // 쿠키가 있으면 인증 되었음
        if (!token) {
            throw new UnauthorizedException('토큰이 없습니다');
        }

        //토큰을 해석하여 user 정보 찾아서 정보 리턴
        try {
            const payload = await this.jwtService.verifyAsync(
                token, {
                secret: jwtConstants.secret
            }
            );
            request['user'] = payload;
        }
        catch{
            throw new UnauthorizedException("유저 정보를 불러오는 데에 실패했습니다.");
        }
        return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

