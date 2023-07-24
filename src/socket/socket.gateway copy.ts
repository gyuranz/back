import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Param } from '@nestjs/common';


@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data:any):void {
    const {message,user_nickname} =data;
    socket.emit('message', `${user_nickname}:${message}`);
  }

  // private publicRooms: string[] = [];

  async handleConnection(socket: any) {
    const room_id = socket.handshake.query.room_id;
    socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });
    
    // socket.on('room', (roomName, showRoom) => {
    //   socket.join(roomName);
    //   this.showRoom(roomName);
    //   console.log(socket.rooms);
    //   socket.to(roomName).emit('greeting', socket.nickname);
    //   this.server.sockets.emit('roomUpdate', this.updatePublicRoom());

    //   showRoom(roomName);
    // });

    socket.on('sendMessage', (message, sendMessage) => {
      message = `${socket.user_nickname}: ${message}`;
      console.log(message);
      // socket.to(room_id).emit('sendMessage', message, sendMessage(message));
    });

    // socket.on('disconnecting', () => {
    //   socket.rooms.forEach((room) =>
    //     socket.to(room).emit('goodbye', socket.nickname),
    //   );
    //   this.server.sockets.emit('roomUpdate', this.updatePublicRoom());
    // });

    socket.on('nickname', (nickname, saveNickname) => {
      socket.nickname = nickname;
      console.log(`설정한 닉네임: ${socket.nickname}`);
      saveNickname(nickname);
    });

  //   socket.on('videoRoomName', (videoRoomName, showVideoOption) => {
  //     socket.join(videoRoomName);
  //     showVideoOption();
  //     socket.to(videoRoomName).emit('videoGreeting');
  //   });

  //   socket.on('offer', (offer, videoRoomName) => {
  //     socket.to(videoRoomName).emit('offer', offer);
  //   });

  //   socket.on('answer', (answer, roomName) => {
  //     socket.to(roomName).emit('answer', answer);
  //   });

  //   socket.on('ice', (ice, videoRoomName) => {
  //     socket.to(videoRoomName).emit('ice', ice);
  //   });
  }

  handleDisconnect(socket: any) {}

//   private updatePublicRoom(): string[] {
//     const {
//       sockets: {
//         adapter: { rooms, sids },
//       },
//     } = this.server;

//     let publicRooms: string[] = [];
//     rooms.forEach((_, key) => {
//       if (sids.get(key) === undefined) {
//         publicRooms.push(key);
//       }
//     });

//     this.publicRooms = publicRooms;
//     return publicRooms;
//   }

//   private showRoom(roomName: string) {
//     this.server.to(roomName).emit('showRoom', roomName);
//   }
}
