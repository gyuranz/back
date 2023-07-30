import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema, Room, RoomSchema, User, UserSchema } from 'src/forms/schema.schema';
import { FindService } from 'src/auth/find.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Room.name, schema: RoomSchema }]),
    ConfigModule.forRoot(),
  ],
  providers: [SocketGateway, SocketService, FindService],
})
export class SocketModule { }