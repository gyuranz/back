import { CanActivate, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';


//CanActivate 매서드는 요청을 진행할 수 있는지 여부를 나타내는 부울 값 또는 Promise<boolean> 반환, 인증이 되었으면 true, false는 403 에러를 보내줌
@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: any): Promise<boolean> {

        //컨텍스트는 Request나 Response 객체를 얻어오는데에 사용. 현재 Request를 가져옴
        const request = context.switchToHttp().getRequest();

        // 쿠키가 있으면 인증 되었음
        if (request.cookies['login']) {
            return true;
        }

        //? 아래부터는 쿠키가 로그인 중 어떠한 이유로 사라진 경우 로그인 상태를 확인하는 과정으로 보인다.
        //쿠키가 없으면 requeste의 body 정보가 존재하는지 확인한다. 둘중 하나라도 없으면 나가리
        if (!request.body.user_nickname || !request.body.user_password) {
            return false;
        }
        console.log(request.body.user_nickname);
        console.log(request.body.user_password);
        console.log('여기까진 되니?');
        //만들어놓은 함수로 검증
        const user = await this.authService.validateUser(
            request.body.user_nickname,
            request.body.user_password,
        );

        if (!user) {
            return false;
        }

        // 유저 정보가 있으면 request에 user정보를 추가하고 true 반환함
        request.user = user;
        return true;
    }
}
