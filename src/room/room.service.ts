import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Summary } from 'src/forms/schema.schema';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Summary.name) private summaryModel: Model<Summary>){}

  async checkRoomExists(roomId: string): Promise<boolean> {
    const room = SocketGateway.rooms.find((room) => room.id === roomId);
    return !!room;
  }

  async isRoomFull(roomId: string): Promise<boolean> {
    const room = SocketGateway.rooms.find((room) => room.id === roomId);
    return room?.connectedUsers.length > 3;
  }

  async findFromDBAndGetSummary(room_id:string, user_nickname:string) {
    const summary = this.summaryModel.find({room_id:room_id,user_nickname:user_nickname}).sort({chat_creatAt:1}).select({message_summary:1, img_url:1});
    return summary;
  }


}
