import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PptDto } from 'src/forms/chat.dto';
import { Chat, Ppt } from 'src/forms/schema.schema';



@Injectable()
export class SocketService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Ppt.name) private pptModel: Model<Ppt>
    ){}


    // createChat(chat):Promise<Chat>{
    //     return this.chatModel.create(chat);

    createChat(socket_id, message_text):Promise<Ppt>{
        const pptdto = {
            socket_id: socket_id,
            message_text: message_text
        }

//         return this.chatModel.create(chat);
        return this.pptModel.create(pptdto);
//     }
}}
