import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatInputDto, } from 'src/forms/chat.dto';
import { Chat, } from 'src/forms/schema.schema';



@Injectable()
export class SocketService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
    ){}


    // createChat(chat):Promise<Chat>{
    //     return this.chatModel.create(chat);

    createChat( chatInputDto:ChatInputDto ):Promise<Chat>{
        const chatdto = {
            user_nickname: chatInputDto.user_nickname,
            chat_text: chatInputDto.message,
            room_id: chatInputDto.room_id
        }

//         return this.chatModel.create(chat);
        return this.chatModel.create(chatdto);
//     }
}}
