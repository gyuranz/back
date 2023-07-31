import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import {
  AnswerDto,
  ChatInputDto,
  IcecandidateDto,
  OfferDto,
} from 'src/forms/chat.dto';
import { SocketService } from './socket.service';
import { v4 as uuidv4 } from 'uuid';

interface MessagePayload {
  room_id: string;
  user_nickname: string;
  message: string;
}

let createdRooms: string[] = [];

@WebSocketGateway({
  //   namespace: '',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketService: SocketService) {}
  private logger = new Logger('Twilio');

  static connectedUsers = [];
  static rooms = [];

  @WebSocketServer() nsp: Namespace;

  @SubscribeMessage('connection')
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(socket: Socket) {
    const user = SocketGateway.connectedUsers.find(
      (user) => user.socketId === socket.id,
    );

    if (user) {
      // remove user from room in server
      const room = SocketGateway.rooms.find((room) => room.id === user.roomId);

      room.connectedUsers = room.connectedUsers.filter(
        (user) => user.socketId !== socket.id,
      );

      // leave socket io room
      socket.leave(user.roomId);

      // emit to all users which are still in the room that user disconnected
      socket.to(room.id).emit('user-disconnected', { socketId: socket.id });

      // emit an event to rest of the users which left in the toom new connectedUsers in room
      socket.to(room.id).emit('room-update', {
        connectedUsers: room.connectedUsers,
      });
    }
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('conn-init')
  initializeConnectionHandler(
    @MessageBody() data,
    @ConnectedSocket() socket: Socket,
  ) {
    const { connUserSocketId } = data;

    const initData = { connUserSocketId: socket.id };
    socket.to(connUserSocketId).emit('conn-init', initData);
  }

  @SubscribeMessage('create-new-room')
  createNewRoomHandler(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log('host is creating new room');
    console.log(data);
    const { identity, onlyAudio } = data;

    const roomId = uuidv4();
    console.log(roomId);
    // create new user
    const newUser = {
      identity,
      id: uuidv4(),
      socketId: socket.id,
      roomId,
      onlyAudio,
    };

    // push that user to connectedUsers
    SocketGateway.connectedUsers = [...SocketGateway.connectedUsers, newUser];

    //create new room
    const newRoom = {
      id: roomId,
      connectedUsers: [newUser],
    };

    // join socket.io room
    socket.join(roomId);
    console.log(socket.rooms);

    SocketGateway.rooms = [...SocketGateway.rooms, newRoom];

    // emit to that client which created that room roomId
    socket.emit('room-id', { roomId });

    // emit an event to all users connected
    // to that room about new users which are right in this room
    socket.emit('room-update', { connectedUsers: newRoom.connectedUsers });
  }

  @SubscribeMessage('join-room')
  joinRoomHandler(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const { identity, roomId, onlyAudio } = data;

    const newUser = {
      identity,
      id: uuidv4(),
      socketId: socket.id,
      roomId,
      onlyAudio,
    };
    console.log(SocketGateway.rooms);
    // join room as user which just is trying to join room passing room id
    const room = SocketGateway.rooms.find((room) => room.id === roomId);
    room.connectedUsers = [...room.connectedUsers, newUser];

    console.log(room);
    // join socket.io room
    socket.join(roomId);

    // add new user to connected users array
    SocketGateway.connectedUsers = [...SocketGateway.connectedUsers, newUser];

    // emit to all users which are already in this room to prepare peer connection
    room.connectedUsers.forEach((user) => {
      if (user.socketId !== socket.id) {
        const data = {
          connUserSocketId: socket.id,
        };

        socket.to(user.socketId).emit('conn-prepare', data);
      }
    });
    socket
      .to(roomId)
      .emit('room-update', { connectedUsers: room.connectedUsers });
  }

  @SubscribeMessage('conn-signal')
  signalingHandler(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const { connUserSocketId, signal } = data;

    const signalingData = { signal, connUserSocketId: socket.id };
    socket.to(connUserSocketId).emit('conn-signal', signalingData);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chatInputDto: ChatInputDto,
  ) {
    this.socketService.createChat(chatInputDto);
    socket.to(chatInputDto.room_id).emit('message', {
      user_nickname: chatInputDto.user_nickname,
      message: chatInputDto.message,
    });
    return {
      user_nickname: chatInputDto.user_nickname,
      message: chatInputDto.message,
    };
  }
}

// gateway로 들어오는 신호에 /room 이 있는 경우 핸드쉐이크, origin 안의 url을 신뢰할 수 있는 url로 등록하여 cors 오류 방지.
// @WebSocketGateway({
//   namespace: `room`,
//   cors: {
//     origin: '*',
//   },
// })
// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(
//     private socketService: SocketService,
//     private findService: FindService,
//     ){};
//   private logger = new Logger('Gateway');

//   @WebSocketServer() nsp: Namespace;
//   // 커넥션 된 경우
//   handleConnection(@ConnectedSocket() socket: Socket, @MessageBody() user_nickname:string) {
//     this.logger.log(`${socket.id} 소켓 연결`);
//   }

//   handleDisconnect(@ConnectedSocket() socket: Socket) {
//     this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
//   }
//   // // 커넥션 된 경우
//   // handleConnection(@ConnectedSocket() user_nickname: string) {
//   //   this.logger.log(`${user_nickname} 소켓 연결`);
//   // }

//   // handleDisconnect(@ConnectedSocket() user_nickname: string) {
//   //   this.logger.log(`${user_nickname} 소켓 연결 해제 ❌`);
//   // }
//   @SubscribeMessage('message')
//   handleMessage(
//     @ConnectedSocket() socket: Socket,
//     @MessageBody() chatInputDto: ChatInputDto,
//   ) {
//     this.socketService.createChat( chatInputDto );
//     socket.to(chatInputDto.room_id).emit('message', { user_nickname: chatInputDto.user_nickname , message:chatInputDto.message });
//     return { user_nickname: chatInputDto.user_nickname , message:chatInputDto.message };
//   }

// //! room/에서 join-room 을 보내지 않으니 auth.gateway로 보냄
// // //시작할 때 한번 'join-room', room_id 보내주어야 함.
// @SubscribeMessage('join-room')
// handleJoinRoom(
//   @ConnectedSocket() socket: Socket,
//   @MessageBody() room_id: string,
// ) {
//   socket.join(room_id); // join room
//   socket.to(room_id).emit('join-room', 'welcome')
//   return { success: true };
// }

// @SubscribeMessage('leave-room')
// handleLeaveRoom(
//   @ConnectedSocket() socket: Socket,
//   @MessageBody() {room_id} : {room_id: string}
// ) {
//   console.log(room_id);
//   socket.leave(room_id); // leave room

//   return { success: true };
// }
// }
