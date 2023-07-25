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

interface MessagePayload {
  room_id: string;
  user_nickname:string;
  message: string;
}

let createdRooms: string[] = [];

// gateway로 들어오는 신호에 /room 이 있는 경우 핸드쉐이크, origin 안의 url을 신뢰할 수 있는 url로 등록하여 cors 오류 방지.
@WebSocketGateway({
  namespace: `room`,
  cors: {
    origin: ['http://gyuranz-bucket.s3-website.ap-northeast-2.amazonaws.com', 'http://localhost:3000', 'http://15.164.100.230:3000'],
  },
})

export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  // 터미널에 연결 잘 되었는지 [Gateway] 라는 이름으로 표시
  private logger = new Logger('Gateway');

  @WebSocketServer() nsp: Namespace;
  // ! 핸드쉐이크랑 동시 connection 이 발생할텐데, 여기에 user_nickname 값을 보낼 수 있는가.
  // 커넥션 된 경우 
  handleConnection(@ConnectedSocket() socket: Socket, @MessageBody() user_nickname:string) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }
  // // 커넥션 된 경우 
  // handleConnection(@ConnectedSocket() user_nickname: string) {
  //   this.logger.log(`${user_nickname} 소켓 연결`);
  // }

  // handleDisconnect(@ConnectedSocket() user_nickname: string) {
  //   this.logger.log(`${user_nickname} 소켓 연결 해제 ❌`);
  // }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('message', { username: socket.id, message });
    return { username: socket.id, message };
  }

  //시작할 때 한번 'join-room', room_id 보내주어야 함.
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room_id: string,
  ) {
    socket.join(room_id); // join room

    return { success: true };
  }
}


