import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: ['http://15.164.100.230:3000'],
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Gateway');

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    // this.nsp.adapter.on('create-room', (room) => {
    //   this.logger.log(`"Room:${room}"이 생성되었습니다.`);
    // });

    // this.nsp.adapter.on('join-room', (room, id) => {
    //   this.logger.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    // });

    // this.nsp.adapter.on('leave-room', (room, id) => {
    //   this.logger.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    // });

    // this.nsp.adapter.on('delete-room', (roomName) => {
    //   this.logger.log(`"Room:${roomName}"이 삭제되었습니다.`);
    // });

    // this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);

    socket.broadcast.emit('message', {
      message: `${socket.id}가 들어왔습니다.`,
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('message', { username: socket.id, message });
    return { username: socket.id, message };
  }
}

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { Injectable, Param } from '@nestjs/common';

// @Injectable()
// // @WebSocketGateway(8000, { namespace: '/'})
// @WebSocketGateway({namespace: 'room'})
// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   private publicRooms: string[] = [];

//   async handleConnection(socket: any) {
//     const room_id = socket.handshake.query.room_id;
//     socket.onAny((event) => {
//       console.log(`Socket Event: ${event}`);
//     });
    
//     // socket.on('room', (roomName, showRoom) => {
//     //   socket.join(roomName);
//     //   this.showRoom(roomName);
//     //   console.log(socket.rooms);
//     //   socket.to(roomName).emit('greeting', socket.nickname);
//     //   this.server.sockets.emit('roomUpdate', this.updatePublicRoom());

//     //   showRoom(roomName);
//     // });

//     socket.on('sendMessage', (message, sendMessage) => {
//       message = `${socket.user_nickname}: ${message}`;
//       console.log(message);
//       // socket.to(room_id).emit('sendMessage', message, sendMessage(message));
//     });

//     socket.on('disconnecting', () => {
//       socket.rooms.forEach((room) =>
//         socket.to(room).emit('goodbye', socket.nickname),
//       );
//       this.server.sockets.emit('roomUpdate', this.updatePublicRoom());
//     });

//     socket.on('nickname', (nickname, saveNickname) => {
//       socket.nickname = nickname;
//       console.log(`설정한 닉네임: ${socket.nickname}`);
//       saveNickname(nickname);
//     });

//   //   socket.on('videoRoomName', (videoRoomName, showVideoOption) => {
//   //     socket.join(videoRoomName);
//   //     showVideoOption();
//   //     socket.to(videoRoomName).emit('videoGreeting');
//   //   });

//   //   socket.on('offer', (offer, videoRoomName) => {
//   //     socket.to(videoRoomName).emit('offer', offer);
//   //   });

//   //   socket.on('answer', (answer, roomName) => {
//   //     socket.to(roomName).emit('answer', answer);
//   //   });

//   //   socket.on('ice', (ice, videoRoomName) => {
//   //     socket.to(videoRoomName).emit('ice', ice);
//   //   });
//   }

//   handleDisconnect(socket: any) {}

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
// }
