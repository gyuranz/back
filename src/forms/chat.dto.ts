import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class ChatInputDto {
    
    // 채팅 칠때 프론트에서?
    @IsString()
    room_id: string;

    // 채팅 칠때 프론트에서
    @IsString()
    username: string;
    
    // 채팅 칠때 게이트웨이(stt, socket)에서
    @IsString()
    message: string;
}

export class PptDto {
    
    @IsString()
    socket_id: string;
    

    @IsString()
    message_text: string;
}
