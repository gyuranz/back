import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class CreateRoomDto {
    @IsString()
    room_name: string;

    @IsString()
    room_password: string;

    @IsString()
    room_id: string;

    @IsString()
    room_summary: string;
}

// 방 조인시 유효성 검사
export class JoinRoomDto {
    @IsString()
    room_id: string;

    @IsString()
    room_password: string;
}