import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema, Ppt, PptSchema } from 'src/forms/schema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:Chat.name, schema:ChatSchema}]),
    MongooseModule.forFeature([{name:Ppt.name, schema:PptSchema}]),
    ConfigModule.forRoot(),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    //   exclude: ['/api*'],
    // }),
  ],
  providers: [SocketGateway, SocketService],
})

export class SocketModule{}