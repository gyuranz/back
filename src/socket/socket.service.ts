import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatInputDto, PptDto } from 'src/forms/chat.dto';
import { Chat, Ppt } from 'src/forms/schema.schema';



@Injectable()
export class SocketService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        // @InjectModel(Ppt.name) private pptModel: Model<Ppt>
    ){}


    // createChat(chat):Promise<Chat>{
    //     return this.chatModel.create(chat);

    createChat( chatInputDto:ChatInputDto ):Promise<Chat>{
        const chatdto = {
            socket_id: chatInputDto.username,
            message_text: chatInputDto.message,
            room_id: chatInputDto.room_id
        }

//         return this.chatModel.create(chat);
        return this.chatModel.create(chatdto);
//     }
}}
