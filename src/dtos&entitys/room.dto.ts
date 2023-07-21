import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class CreateRoomDto{

    @IsNumber()
    room_code: number;
    
    @IsString()
    room_name: string;
    
    @IsString()
    summary: string 
}

// 방 조인시 유효성 검사
export class JoinRoomDto{ 
    @IsNumber()
    room_code: number;
    
    @IsString()
    room_name: string;
    
    @IsString()
    summary: string 

    @IsString()
    room_invite_key: string;
}