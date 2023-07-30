import { Inject,Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { ChatInputDto, } from 'src/forms/chat.dto';
import { Chat, Room, User, } from 'src/forms/schema.schema';

@Injectable()
export class SocketService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
    ) {
    }

    // createChat(chat):Promise<Chat>{
    //     return this.chatModel.create(chat);

    createChat(chatDto: ChatInputDto): Promise<Chat> {

        //         return this.chatModel.create(chat);
        return this.chatModel.create(chatDto);
        //     }
    }
    generateRandomString(length: number): string {
        const bytes = randomBytes(Math.ceil(length / 2));
        return bytes.toString('hex').slice(0, length);
    }


}
