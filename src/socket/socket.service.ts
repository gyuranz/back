import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/forms/schema.schema';

@Injectable()
export class SocketService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>
    ){}


    createChat(chat):Promise<Chat>{
        return this.chatModel.create(chat);
    }
}
