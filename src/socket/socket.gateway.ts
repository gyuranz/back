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
import { AnswerDto, ChatInputDto, IcecandidateDto, OfferDto } from 'src/forms/chat.dto';
import { SocketService } from './socket.service';
import { FindService } from 'src/auth/find.service';


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
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private findService: FindService,
    ){};
  private logger = new Logger('Gateway');

  @WebSocketServer() nsp: Namespace;
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
    @MessageBody() chatInputDto: ChatInputDto,
  ) {
    this.socketService.createChat( chatInputDto );
    socket.to(chatInputDto.room_id).emit('message', { user_nickname: chatInputDto.user_nickname , message:chatInputDto.message });
    return { user_nickname: chatInputDto.user_nickname , message:chatInputDto.message };
  }

  //! room/에서 join-room 을 보내지 않으니 auth.gateway로 보냄
  // //시작할 때 한번 'join-room', room_id 보내주어야 함.
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room_id: string,
  ) {
    socket.join(room_id); // join room
    socket.to(room_id).emit('join-room', 'welcome')
    return { success: true };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() {room_id} : {room_id: string}
  ) {
    console.log(room_id);
    socket.leave(room_id); // leave room

    return { success: true };
  }

  @SubscribeMessage('offer')
  handleOfferMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() offerDto: OfferDto,

  ) {
    socket.to(offerDto.roomName).emit('offer', { username: socket.id, offer:offerDto.offer });
  }

  @SubscribeMessage('answer')
  handleAnswerMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() answerDto: AnswerDto,
  ) {
      socket.to(answerDto.roomName).emit('answer', { username: socket.id, answer:answerDto.answer });
    }

  @SubscribeMessage('ice')
  handleIceCandidateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() icecandidateDto:IcecandidateDto,
  ) {
    socket.to(icecandidateDto.roomName).emit('ice', { username: socket.id, ice:icecandidateDto.ice });
  }
}