import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private publicRooms: string[] = [];

  async handleConnection(socket: any) {
    socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });

    socket.on('room', (roomName, showRoom) => {
      socket.join(roomName);
      this.showRoom(roomName);
      console.log(socket.rooms);
      socket.to(roomName).emit('greeting', socket.nickname);
      this.server.sockets.emit('roomUpdate', this.updatePublicRoom());
      
      socket.on('message', (message, sendMessage) => {
        message = `${socket.nickname}: ${message}`;
        socket.to(roomName).emit('sendMessage', message, sendMessage(message));
      });
  
      showRoom(roomName);
    });

    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) =>
        socket.to(room).emit('goodbye', socket.nickname),
      );
      this.server.sockets.emit('roomUpdate', this.updatePublicRoom());
    });

    socket.on('nickname', (nickname, saveNickname) => {
      socket.nickname = nickname;
      console.log(`설정한 닉네임: ${socket.nickname}`);
      saveNickname(nickname);
    });

    socket.on('videoRoomName', (videoRoomName, showVideoOption) => {
      socket.join(videoRoomName);
      showVideoOption();
      socket.to(videoRoomName).emit('videoGreeting');
    });

    socket.on('offer', (offer, videoRoomName) => {
      socket.to(videoRoomName).emit('offer', offer);
    });

    socket.on('answer', (answer, roomName) => {
      socket.to(roomName).emit('answer', answer);
    });

    socket.on('ice', (ice, videoRoomName) => {
      socket.to(videoRoomName).emit('ice', ice);
    });
  }

  handleDisconnect(socket: any) {}

  private updatePublicRoom(): string[] {
    const {
      sockets: {
        adapter: { rooms, sids },
      },
    } = this.server;

    let publicRooms: string[] = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });

    this.publicRooms = publicRooms;
    return publicRooms;
  }

  private showRoom(roomName: string) {
    this.server.to(roomName).emit('showRoom', roomName);
  }
}
