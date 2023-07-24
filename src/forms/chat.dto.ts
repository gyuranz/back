import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class ChatInputDto {
    
    // 채팅 칠때 프론트에서?
    @IsString()
    room_id: string;

    // 채팅 칠때 프론트에서
    @IsString()
    user_nickname: string;
    
    // 채팅 칠때 프론트에서
    @IsString()
    user_id: string;
    
    // 채팅 칠때 게이트웨이(stt, socket)에서
    @IsString()
    chat_text: string;
}