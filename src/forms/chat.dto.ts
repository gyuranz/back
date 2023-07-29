import { IsNumber, IsString, isString } from "class-validator";


// 방 생성시 유효성 검사
export class ChatInputDto {
    
    @IsString()
    room_id: string;

    @IsString()
    user_nickname: string;
    
    @IsString()
    message: string;
}

export class OfferDto {
    
    @IsString()
    roomName: string;
    
    offer: any;
}

export class AnswerDto {
    
    @IsString()
    roomName: string;
    
    answer: any;
}

export class IcecandidateDto {
    

    @IsString()
    roomName: string;

    ice:any;
}

