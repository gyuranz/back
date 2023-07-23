import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class CreateRoomDto{
    @IsString()
    user_nickname:string;

    @IsString()
    room_name: string;
    
    @IsString()
    room_password: string;
}

// 방 조인시 유효성 검사
export class JoinRoomDto{ 
    @IsString()
    user_nickname:string;
    
    @IsString()
    room_id: number;

    @IsString()
    room_password: string;
}