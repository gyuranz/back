import { IsString, isNotEmpty, Min, Max } from "class-validator";


// 유저 패스워드와 닉네임 필드를 만들고 데코레이터 붙이기, 회원가입 시 유효성검사
export class CreateUserDto{

    // 문자열인지, string의 값이 2~20 사이인지 체크한다.
    @IsString()
    // @Min(2)
    // @Max(20)
    user_id:string;
    
    // 문자열인지, string의 값이 2~20 사이인지 체크한다.
    @IsString()
    // @Min(2)
    // @Max(20)
    user_nickname:string;

    // 문자열인지, string의 값이 6~20 사이인지 체크한다.
    @IsString()
    // @Min(6)
    // @Max(20)
    user_password:string;

    
}

// 유저 패스워드와 닉네임 필드를 만들고 데코레이터 붙이기, 회원정보 수정 시 유효성검사
export class UpdateUserDto{

    @IsString()
    // @Min(2)
    // @Max(20)
    user_id:string;

    @IsString()
    // @Min(2)
    // @Max(20)
    user_nickname:string;

    @IsString()
    // @Min(6)
    // @Max(20)
    user_password:string;
}

export class LoginDto{
    @IsString()
    // @Min(2)
    // @Max(20)
    user_id:string;

    @IsString()
    // @Min(2)
    // @Max(20)
    user_nickname:string;

    @IsString()
    // @Min(6)
    // @Max(20)
    user_password:string;
}

//! 389~390 쪽~♥ 에 validator 데코레이터 설명 있음
//! user:string 은 ts에서 컴파일 타임 유형 검사를 위해 사용하는 정적 유형 주석일 뿐 런타임 유효성 검사를 제공하지는 않는다.
//! 반면, @Isstring은 클래스 속성에 대한 유효성 검사를 하며, 문자열이 아닌 경우 유효성 검사 오류를 발생한다.