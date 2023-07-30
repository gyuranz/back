import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  // Replace this with your actual implementation to fetch data from the rooms array or database
  private rooms: any[] = [];

  async checkRoomExists(roomId: string): Promise<boolean> {
    const room = this.rooms.find((room) => room.id === roomId);
    return !!room;
  }

  async isRoomFull(roomId: string): Promise<boolean> {
    const room = this.rooms.find((room) => room.id === roomId);
    return room?.connectedUsers.length > 3;
  }
}