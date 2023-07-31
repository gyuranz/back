import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class RoomService {
  // Replace this with your actual implementation to fetch data from the rooms array or database
  //   constructor(private socketGateway: SocketGateway) {}

  async checkRoomExists(roomId: string): Promise<boolean> {
    const room = SocketGateway.rooms.find((room) => room.id === roomId);
    return !!room;
  }

  async isRoomFull(roomId: string): Promise<boolean> {
    const room = SocketGateway.rooms.find((room) => room.id === roomId);
    return room?.connectedUsers.length > 3;
  }
}
